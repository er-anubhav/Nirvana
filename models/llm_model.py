import traceback
import json
import google.generativeai as genai
from config import logger, GEMINI_API_KEY, GEMINI_MODEL, SYSTEM_INSTRUCTION

def get_llm_response(prompt_text, user_history=None):
    if not GEMINI_API_KEY:
        return "I'm sorry, my AI brain isn't configured correctly. Please check the server setup."

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)  # type: ignore

        chat_history_for_start = [{"role": "user", "parts": [{"text": SYSTEM_INSTRUCTION}]}]
        if user_history:
            chat_history_for_start.extend(user_history)

        current_user_prompt_content = {"role": "user", "parts": [{"text": prompt_text}]}

        chat_session = model.start_chat(history=chat_history_for_start)  # type: ignore
        response = chat_session.send_message(current_user_prompt_content)

        return response.text

    except genai.types.BlockedPromptException as e:  # type: ignore
        logger.warning(f"LLM request blocked: {e}. Prompt: {prompt_text}. History: {user_history}")
        return "I'm sorry, I cannot respond to that specific query. Is there something else I can help you with related to Nirvana or a complaint?"
    except Exception as e:
        logger.error(f"Error getting LLM response: {e}")
        logger.error(traceback.format_exc())
        return "I'm sorry, I'm having trouble understanding you right now. Could you please rephrase or try again later?"

def analyze_complaint_text(text):
    """
    Use smart AI to intelligently analyze complaint text and consistently determine:
    1. Department assignment (using comprehensive context analysis)
    2. Severity score (based on urgency and impact)
    3. Whether an image is needed (based on problem type)
    """
    try:
        if not GEMINI_API_KEY:
            # Fallback to simple keyword matching if LLM unavailable
            return _fallback_complaint_analysis(text)
        
        # Use advanced LLM analysis with comprehensive context understanding
        prompt = f"""
You are an expert municipal administrator with 20+ years of experience in civic complaint routing and municipal department management. Your task is to intelligently analyze citizen complaints and route them to the most appropriate department with high accuracy.

COMPLAINT TEXT: "{text}"

Analyze this complaint using your deep understanding of municipal operations and provide:

1. DEPARTMENT: Determine the most appropriate municipal department. Be very precise in your analysis:

   🏗️ **Public Works** - Infrastructure, construction, roads, bridges, traffic management
   - Roads, potholes, traffic signals, street infrastructure
   - Public buildings, parks, sidewalks
   - Construction permits, infrastructure maintenance
   - Traffic management, road repairs

   💧 **Water** - Water supply, sewage, drainage systems, manholes
   - Water supply issues, pipe leaks, water quality
   - Sewage systems, drainage problems
   - Manholes (open, damaged, missing covers)
   - Storm drains, flood management

   ⚡ **Electricity** - Power supply, electrical infrastructure, street lighting
   - Power outages, electrical faults
   - Street lighting, electrical infrastructure
   - Power lines, transformers, electrical safety

   🗑️ **Sanitation** - Waste management, cleanliness, public hygiene
   - Garbage collection, waste disposal
   - Street cleaning, public toilet maintenance
   - Recycling, waste management policies

   🏥 **Health** - Public health, medical facilities, health emergencies
   - Hospitals, clinics, medical services
   - Public health issues, disease control
   - Health emergencies, medical infrastructure

   🚌 **Transport** - Public transportation, traffic regulation
   - Buses, trains, metro services
   - Transportation policies, route planning
   - Vehicle permits, transportation infrastructure

   📋 **General** - Administrative issues, multi-department coordination
   - Administrative complaints, policy issues
   - Multi-department coordination required
   - Unclear categorization

2. SEVERITY: Rate urgency from 0.1 to 1.0 with high precision:
   - **0.9-1.0**: CRITICAL - Immediate safety hazard, emergency, life-threatening
   - **0.7-0.8**: HIGH - Significant disruption, safety concern, major inconvenience
   - **0.5-0.6**: MEDIUM - Notable problem, affects daily activities
   - **0.3-0.4**: LOW - Minor issue, improvement needed
   - **0.1-0.2**: MINIMAL - Suggestion, feedback, non-urgent

3. NEEDS_IMAGE: Determine if visual evidence would significantly help:
   - **YES**: Physical damage, visible problems, infrastructure issues
   - **NO**: Service requests, policy issues, administrative matters

Consider context, urgency keywords, safety implications, and citizen impact.

Respond in exactly this format:
DEPARTMENT: [department name]
SEVERITY: [0.1-1.0]
NEEDS_IMAGE: [YES/NO]
REASONING: [Detailed explanation of your expert analysis]

Examples for consistency:
- "Manhole cover missing on main road" → Water, 0.9, YES (Safety hazard, water department responsibility)
- "Street light not working" → Electricity, 0.6, YES (Public safety, electrical infrastructure)
- "Garbage not collected for 3 days" → Sanitation, 0.7, YES (Public health concern)
- "Bus is always late" → Transport, 0.4, NO (Service quality issue)
"""

        try:
            model = genai.GenerativeModel(GEMINI_MODEL)  # type: ignore
            response = model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Parse LLM response
            lines = result_text.split('\n')
            department_line = next((line for line in lines if line.startswith('DEPARTMENT:')), None)
            severity_line = next((line for line in lines if line.startswith('SEVERITY:')), None)
            needs_image_line = next((line for line in lines if line.startswith('NEEDS_IMAGE:')), None)
            reasoning_line = next((line for line in lines if line.startswith('REASONING:')), None)
            
            if department_line and severity_line and needs_image_line:
                department = department_line.split('DEPARTMENT:', 1)[1].strip()
                severity_str = severity_line.split('SEVERITY:', 1)[1].strip()
                needs_image_str = needs_image_line.split('NEEDS_IMAGE:', 1)[1].strip()
                reasoning = reasoning_line.split('REASONING:', 1)[1].strip() if reasoning_line else "LLM analysis"
                
                # Validate and convert severity
                try:
                    severity_score = float(severity_str)
                    severity_score = max(0.1, min(1.0, severity_score))  # Clamp between 0.1 and 1.0
                except ValueError:
                    severity_score = 0.5
                
                # Convert needs_image
                needs_image = 'YES' in needs_image_str.upper()
                
                logger.info(f"LLM complaint analysis - Department: {department}, Severity: {severity_score}, Needs Image: {needs_image}, Reasoning: {reasoning}")
                
                return {
                    'department': department,
                    'severity_score': severity_score,
                    'needs_image': needs_image
                }
            else:
                logger.warning("LLM response format unexpected, falling back to keyword analysis")
                return _fallback_complaint_analysis(text)
                
        except Exception as llm_error:
            logger.error(f"LLM complaint analysis failed: {llm_error}")
            return _fallback_complaint_analysis(text)
            
    except Exception as e:
        logger.error(f"Error in analyze_complaint_text: {e}")
        return _fallback_complaint_analysis(text)

def _fallback_complaint_analysis(text):
    """
    Fallback keyword-based complaint analysis for when LLM is unavailable
    """
    try:
        text_lower = text.lower()
        
        # Determine department based on keywords
        department = 'General'
        if any(word in text_lower for word in ['water', 'pipe', 'leak', 'tap', 'sewage', 'drainage', 'manhole', 'sewer']):
            department = 'Water'
        elif any(word in text_lower for word in ['electricity', 'power', 'light', 'wire', 'blackout']):
            department = 'Electricity'
        elif any(word in text_lower for word in ['road', 'pothole', 'street', 'traffic', 'signal']):
            department = 'Public Works'
        elif any(word in text_lower for word in ['garbage', 'trash', 'waste', 'clean']):
            department = 'Sanitation'
        elif any(word in text_lower for word in ['health', 'hospital', 'medical', 'doctor']):
            department = 'Health'
        elif any(word in text_lower for word in ['bus', 'transport', 'metro', 'train']):
            department = 'Transport'
        
        # Determine severity based on urgency keywords
        severity_score = 0.5
        if any(word in text_lower for word in ['emergency', 'urgent', 'danger', 'broken', 'accident', 'fire']):
            severity_score = 0.9
        elif any(word in text_lower for word in ['not working', 'damaged', 'problem', 'issue']):
            severity_score = 0.7
        elif any(word in text_lower for word in ['complaint', 'request', 'improve', 'suggestion']):
            severity_score = 0.3
        
        # Determine if image is needed
        needs_image = any(word in text_lower for word in [
            'broken', 'damaged', 'pothole', 'leak', 'wire', 'garbage', 'construction',
            'manhole', 'open manhole', 'sewer', 'drainage', 'graffiti',
            'see', 'look', 'visible', 'show', 'proof', 'evidence'
        ])
        
        return {
            'department': department,
            'severity_score': severity_score,
            'needs_image': needs_image
        }
        
    except Exception as e:
        logger.error(f"Error in fallback complaint analysis: {e}")
        # Return default values if analysis fails
        return {
            'department': 'General',
            'severity_score': 0.5,
            'needs_image': False
        }

def validate_image_text_consistency(complaint_text, yolo_result):
    """
    Use LLM to intelligently validate if the YOLO image recognition result 
    matches the complaint description using semantic analysis
    """
    try:
        if not yolo_result:
            return False, "Unable to analyze image content"
        
        if not GEMINI_API_KEY:
            # Fallback to simple keyword matching if LLM unavailable
            return _fallback_consistency_check(complaint_text, yolo_result)
        
        # Use LLM for intelligent semantic matching
        prompt = f"""
You are an expert at determining if visual content matches textual descriptions for civic complaints.

COMPLAINT DESCRIPTION: "{complaint_text}"
IMAGE ANALYSIS RESULT: "{yolo_result}"

Analyze if the image content is relevant to and supports the complaint description.

Consider:
- Semantic relationships (e.g., "manhole" complaint with "open hole" image)
- Context appropriateness (e.g., infrastructure issues need infrastructure images)
- Reasonable variations in terminology
- Related objects that support the complaint

Respond with exactly this format:
MATCH: [YES/NO]
REASON: [Brief explanation of why it matches or doesn't match]
CONFIDENCE: [1-10 scale]

Examples:
- Manhole complaint + "open manhole" image = YES
- Pothole complaint + "road damage" image = YES  
- Water leak complaint + "garbage" image = NO
- Electrical issue + "wire/cable" image = YES
"""

        try:
            model = genai.GenerativeModel(GEMINI_MODEL)  # type: ignore
            response = model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Parse LLM response
            lines = result_text.split('\n')
            match_line = next((line for line in lines if line.startswith('MATCH:')), None)
            reason_line = next((line for line in lines if line.startswith('REASON:')), None)
            confidence_line = next((line for line in lines if line.startswith('CONFIDENCE:')), None)
            
            if match_line:
                is_match = 'YES' in match_line.upper()
                reason = reason_line.split('REASON:', 1)[1].strip() if reason_line else "LLM analysis completed"
                confidence = confidence_line.split('CONFIDENCE:', 1)[1].strip() if confidence_line else "N/A"
                
                logger.info(f"LLM consistency check - Match: {is_match}, Confidence: {confidence}, Reason: {reason}")
                
                if is_match:
                    return True, f"✅ Image matches complaint: {reason}"
                else:
                    return False, f"❌ Image doesn't match complaint: {reason}"
            else:
                logger.warning("LLM response format unexpected, falling back to keyword matching")
                return _fallback_consistency_check(complaint_text, yolo_result)
                
        except Exception as llm_error:
            logger.error(f"LLM consistency check failed: {llm_error}")
            return _fallback_consistency_check(complaint_text, yolo_result)
            
    except Exception as e:
        logger.error(f"Error in validate_image_text_consistency: {e}")
        return False, "Error validating image content"

def _fallback_consistency_check(complaint_text, yolo_result):
    """
    Fallback keyword-based consistency check for when LLM is unavailable
    """
    try:
        text_lower = complaint_text.lower()
        yolo_lower = yolo_result.lower()
        
        # Key civic infrastructure categories with their related terms
        categories = {
            'road_infrastructure': {
                'complaint_terms': ['pothole', 'road', 'street', 'crack', 'asphalt', 'pavement'],
                'image_terms': ['road', 'pothole', 'crack', 'asphalt', 'street', 'pavement']
            },
            'water_drainage': {
                'complaint_terms': ['water', 'pipe', 'leak', 'manhole', 'sewer', 'sewage', 'drainage', 'drain'],
                'image_terms': ['pipe', 'water', 'leak', 'manhole', 'open manhole', 'sewer', 'sewage', 'drainage', 'drain', 'hole']
            },
            'electrical': {
                'complaint_terms': ['wire', 'electricity', 'power', 'cable', 'electrical'],
                'image_terms': ['wire', 'cable', 'electrical', 'power', 'pole']
            },
            'waste_management': {
                'complaint_terms': ['garbage', 'trash', 'waste', 'litter'],
                'image_terms': ['garbage', 'trash', 'waste', 'bin', 'litter']
            },
            'general_infrastructure': {
                'complaint_terms': ['broken', 'damaged', 'construction'],
                'image_terms': ['damaged', 'broken', 'construction', 'repair']
            }
        }
        
        # Check each category for matches
        for category, terms in categories.items():
            complaint_match = any(term in text_lower for term in terms['complaint_terms'])
            image_match = any(term in yolo_lower for term in terms['image_terms'])
            
            if complaint_match and image_match:
                return True, f"Image matches complaint category: {category.replace('_', ' ')}"
        
        return False, f"Image content ({yolo_result}) doesn't match complaint description"
        
    except Exception as e:
        logger.error(f"Error in fallback consistency check: {e}")
        return False, "Error validating image content"

def is_spam_image(yolo_result):
    """
    Use LLM to intelligently detect if the image is spam (irrelevant content) based on YOLO results
    """
    try:
        if not yolo_result:
            return True, "Unable to analyze image"
        
        if not GEMINI_API_KEY:
            # Fallback to simple keyword matching if LLM unavailable
            return _fallback_spam_detection(yolo_result)
        
        # Use LLM for intelligent spam detection
        prompt = f"""
You are an expert at identifying whether images are relevant for civic complaint systems.

IMAGE ANALYSIS RESULT: "{yolo_result}"

Determine if this image contains content relevant to civic infrastructure complaints or if it's spam/irrelevant.

RELEVANT CONTENT includes:
- Infrastructure: roads, buildings, public facilities
- Utilities: water pipes, electrical systems, manholes, drainage
- Public issues: potholes, damage, construction, waste, graffiti
- Municipal services: garbage, street lighting, traffic

SPAM/IRRELEVANT CONTENT includes:
- Personal photos: selfies, people, faces
- Indoor/private spaces: bedrooms, kitchens, offices
- Personal items: food, drinks, clothing, toys
- Entertainment: games, movies, personal activities
- Animals/pets (unless related to public health issues)

Respond with exactly this format:
SPAM: [YES/NO]
REASON: [Brief explanation]
CONFIDENCE: [1-10 scale]

Examples:
- "person, face, selfie" → YES (personal photo)
- "open manhole, road" → NO (civic infrastructure)
- "food, drink, restaurant" → YES (irrelevant to civic issues)
- "pothole, asphalt, damage" → NO (infrastructure problem)
"""

        try:
            model = genai.GenerativeModel(GEMINI_MODEL)  # type: ignore
            response = model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Parse LLM response
            lines = result_text.split('\n')
            spam_line = next((line for line in lines if line.startswith('SPAM:')), None)
            reason_line = next((line for line in lines if line.startswith('REASON:')), None)
            confidence_line = next((line for line in lines if line.startswith('CONFIDENCE:')), None)
            
            if spam_line:
                is_spam = 'YES' in spam_line.upper()
                reason = reason_line.split('REASON:', 1)[1].strip() if reason_line else "LLM analysis completed"
                confidence = confidence_line.split('CONFIDENCE:', 1)[1].strip() if confidence_line else "N/A"
                
                logger.info(f"LLM spam detection - Spam: {is_spam}, Confidence: {confidence}, Reason: {reason}")
                
                if is_spam:
                    return True, f"Image appears to be spam: {reason}"
                else:
                    return False, f"Image appears legitimate: {reason}"
            else:
                logger.warning("LLM response format unexpected, falling back to keyword matching")
                return _fallback_spam_detection(yolo_result)
                
        except Exception as llm_error:
            logger.error(f"LLM spam detection failed: {llm_error}")
            return _fallback_spam_detection(yolo_result)
            
    except Exception as e:
        logger.error(f"Error in is_spam_image: {e}")
        return False, "Error analyzing image"

def _fallback_spam_detection(yolo_result):
    """
    Fallback keyword-based spam detection for when LLM is unavailable
    """
    try:
        yolo_lower = yolo_result.lower()
        
        # List of spam/irrelevant objects
        spam_objects = [
            'person', 'people', 'face', 'selfie', 'food', 'drink', 'animal', 'pet',
            'indoor', 'bedroom', 'kitchen', 'office', 'restaurant', 'shop',
            'car interior', 'vehicle interior', 'entertainment', 'game', 'toy',
            'clothing', 'fashion', 'jewelry', 'makeup', 'personal item'
        ]
        
        # Infrastructure/civic related objects (legitimate)
        civic_objects = [
            'road', 'street', 'pothole', 'crack', 'asphalt', 'concrete',
            'pipe', 'water', 'leak', 'drainage', 'sewage', 'manhole', 'open manhole', 'sewer', 'drain',
            'wire', 'cable', 'electrical', 'power', 'pole',
            'garbage', 'trash', 'waste', 'bin', 'litter',
            'building', 'infrastructure', 'construction', 'damaged',
            'broken', 'repair', 'maintenance', 'public', 'graffiti', 'illegal graffiti'
        ]
        
        # Check for spam content
        for spam_obj in spam_objects:
            if spam_obj in yolo_lower:
                return True, f"Image appears to be spam: contains {spam_obj}"
        
        # Check for legitimate civic content
        for civic_obj in civic_objects:
            if civic_obj in yolo_lower:
                return False, f"Image appears legitimate: contains {civic_obj}"
        
        # If uncertain, allow but flag
        return False, "Image content unclear but allowed"
        
    except Exception as e:
        logger.error(f"Error in fallback spam detection: {e}")
        return False, "Error analyzing image"

def validate_location_format(location_data):
    """
    Validate location data - ONLY accepts latitude/longitude coordinates from WhatsApp.
    No text addresses allowed.
    """
    try:
        # Handle None case
        if location_data is None:
            return False, "No location data provided. Please share your location via WhatsApp."
            
        # Only accept dictionary with lat/lng (from WhatsApp location message)
        if isinstance(location_data, dict):
            if 'latitude' in location_data and 'longitude' in location_data:
                try:
                    lat = float(location_data['latitude'])
                    lng = float(location_data['longitude'])
                    
                    # Validate coordinate ranges
                    if -90 <= lat <= 90 and -180 <= lng <= 180:
                        return True, f"Location coordinates received: {lat:.6f}, {lng:.6f}"
                    else:
                        return False, "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180."
                except (ValueError, TypeError):
                    return False, "Invalid coordinate format. Please share your location via WhatsApp."
            else:
                return False, "Invalid location data format. Please share your location via WhatsApp."
        
        # Reject text addresses - only coordinates allowed
        elif isinstance(location_data, str):
            return False, "Text addresses are not supported. Please share your exact location via WhatsApp's location sharing feature."
        
        else:
            return False, "Invalid location data. Please share your location via WhatsApp."
        
    except Exception as e:
        logger.error(f"Error validating location: {e}")
        return False, "Error validating location format. Please share your location via WhatsApp."

def enhance_complaint_details(text, department=None, location_data=None):
    """
    Generate enhanced title and description for a complaint using AI
    
    Args:
        text: Original complaint text
        department: Department assigned to the complaint
        location_data: Location information (lat, lng, address)
        
    Returns:
        dict with enhanced_title, enhanced_description, and other details
    """
    try:
        if not GEMINI_API_KEY:
            # Fallback to basic enhancement if LLM unavailable
            return _fallback_complaint_enhancement(text, department, location_data)
        
        # Prepare location context
        location_context = ""
        if location_data:
            if isinstance(location_data, dict):
                if 'latitude' in location_data and 'longitude' in location_data:
                    lat = location_data['latitude']
                    lng = location_data['longitude']
                    location_context = f"Location: {lat}, {lng}"
                elif 'address' in location_data:
                    location_context = f"Location: {location_data['address']}"
            elif isinstance(location_data, str):
                location_context = f"Location: {location_data}"
        
        prompt = f"""
You are an expert municipal complaint processing AI. Your task is to enhance citizen complaints with professional titles and detailed descriptions suitable for government records.

ORIGINAL COMPLAINT: "{text}"
DEPARTMENT: {department or 'Not specified'}
{location_context}

Please enhance this complaint by providing:

1. PROFESSIONAL_TITLE: Create a clear, concise, professional title (max 80 characters) that describes the issue precisely. Use format like "Issue Type - Location Description" or "Department Service - Problem Description"

2. ENHANCED_DESCRIPTION: Expand the original complaint into a detailed, professional description that includes:
   - Clear description of the problem
   - Specific location details if available
   - Impact on citizens/community
   - Any urgency indicators
   - Professional language suitable for government records

3. ASSIGNED_TO: Leave this field empty for now - assignment will be handled by the system

Examples:
- "Garbage on street" → "Waste Management - Uncollected Garbage Near Residential Area"
- "Street light not working" → "Electrical Infrastructure - Non-functional Street Light"
- "Water leakage" → "Water Supply - Pipe Leakage Causing Road Damage"

Respond in exactly this format:
PROFESSIONAL_TITLE: [enhanced title here]
ENHANCED_DESCRIPTION: [detailed professional description here]
ASSIGNED_TO: [leave empty]
"""

        try:
            model = genai.GenerativeModel(GEMINI_MODEL)  # type: ignore
            response = model.generate_content(prompt)
            result_text = response.text.strip()
              # Parse LLM response
            lines = result_text.split('\n')
            title_line = next((line for line in lines if line.startswith('PROFESSIONAL_TITLE:')), None)
            description_line = next((line for line in lines if line.startswith('ENHANCED_DESCRIPTION:')), None)
            assigned_line = next((line for line in lines if line.startswith('ASSIGNED_TO:')), None)
            
            if title_line and description_line:
                enhanced_title = title_line.split('PROFESSIONAL_TITLE:', 1)[1].strip()
                enhanced_description = description_line.split('ENHANCED_DESCRIPTION:', 1)[1].strip()
                # Don't extract assigned_to since database expects UUID, not department names
                
                # Add location details to description if available
                if location_context and location_context not in enhanced_description:
                    enhanced_description += f"\n\n{location_context}"
                    if isinstance(location_data, dict) and 'latitude' in location_data and 'longitude' in location_data:
                        lat = location_data['latitude']
                        lng = location_data['longitude']
                        maps_link = f"https://maps.google.com/?q={lat},{lng}"
                        enhanced_description += f"\nGoogle Maps: {maps_link}"
                
                logger.info(f"Enhanced complaint - Title: {enhanced_title[:50]}...")
                
                return {
                    'enhanced_title': enhanced_title,
                    'enhanced_description': enhanced_description,
                    'assigned_to': None,  # Set to None since database expects UUID
                    'original_text': text,
                }
            else:
                logger.warning("LLM response format unexpected, falling back to basic enhancement")
                return _fallback_complaint_enhancement(text, department, location_data)
                
        except Exception as llm_error:
            logger.error(f"LLM complaint enhancement failed: {llm_error}")
            return _fallback_complaint_enhancement(text, department, location_data)
            
    except Exception as e:
        logger.error(f"Error in enhance_complaint_details: {e}")
        return _fallback_complaint_enhancement(text, department, location_data)

def _fallback_complaint_enhancement(text, department=None, location_data=None):
    """
    Fallback enhancement when LLM is unavailable
    """
    try:
        # Create basic enhanced title
        text_lower = text.lower()
        
        # Simple title generation based on keywords
        if any(word in text_lower for word in ['garbage', 'waste', 'trash', 'kooda']):
            enhanced_title = "Waste Management - Garbage Collection Issue"
        elif any(word in text_lower for word in ['light', 'street light', 'lamp']):
            enhanced_title = "Electrical Infrastructure - Street Lighting Issue"
        elif any(word in text_lower for word in ['water', 'leak', 'pipe', 'pani']):
            enhanced_title = "Water Supply - Infrastructure Issue"
        elif any(word in text_lower for word in ['road', 'pothole', 'street', 'sadak']):
            enhanced_title = "Public Works - Road Infrastructure Issue"
        elif any(word in text_lower for word in ['noise', 'pollution', 'shor']):
            enhanced_title = "Environmental - Noise Pollution Complaint"
        else:
            enhanced_title = f"{department or 'General'} - Citizen Complaint"
        
        # Create enhanced description
        enhanced_description = f"Citizen complaint regarding: {text}"
        
        # Add location if available
        if location_data:
            if isinstance(location_data, dict) and 'latitude' in location_data:
                lat = location_data['latitude']
                lng = location_data['longitude']
                enhanced_description += f"\n\nLocation: {lat}, {lng}"
                enhanced_description += f"\nGoogle Maps: https://maps.google.com/?q={lat},{lng}"
            elif isinstance(location_data, str):
                enhanced_description += f"\n\nLocation: {location_data}"
        
        enhanced_description += f"\n\nThis complaint has been logged for {department or 'appropriate'} department review and action."
        
        return {
            'enhanced_title': enhanced_title,
            'enhanced_description': enhanced_description,
            'assigned_to': None,  # Set to None since database expects UUID
            'original_text': text,
            'processing_method': 'Keyword_Based'
        }
        
    except Exception as e:
        logger.error(f"Error in fallback complaint enhancement: {e}")
        return {
            'enhanced_title': "Citizen Complaint",
            'enhanced_description': text,
            'assigned_to': None,  # Set to None since database expects UUID
            'original_text': text,
            'processing_method': 'Basic_Fallback'
        }

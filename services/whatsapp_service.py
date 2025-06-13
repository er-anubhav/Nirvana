import requests
import traceback
from datetime import datetime
from config import logger, ACCESS_TOKEN, PHONE_NUMBER_ID, user_states
from services.db_service import (
    get_user_by_phone,
    create_complaint,
    get_user_complaints,
    get_complaint_by_id,
    add_comment_to_complaint
)
from models.llm_model import analyze_complaint_text, get_llm_response, validate_location_format, validate_image_text_consistency, enhance_complaint_details
from services.voice_service_tts import voice_service

# States for complaint workflow
STATES = {
    'INIT': 'init',
    'DESCRIPTION': 'description',
    'LOCATION': 'location',
    'MEDIA_UPLOAD': 'media_upload',
    'CONFIRMATION': 'confirmation',
    'COMPLETED': 'completed'
}

def send_reply(to, message):
    url = f'https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages'
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": message}
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        logger.info(f"Message sent to {to}, response: {response.status_code}")

        if response.status_code != 200:
            logger.error(f"Failed to send message: {response.status_code} - {response.text}")
            return False
        return True
    except requests.exceptions.Timeout:
        logger.error("Timeout sending message")
        return False
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        logger.error(traceback.format_exc())
        return False

def download_whatsapp_media(media_id):
    """Download media from WhatsApp using media ID"""
    try:
        # Get media URL
        url = f'https://graph.facebook.com/v18.0/{media_id}'
        headers = {
            'Authorization': f'Bearer {ACCESS_TOKEN}'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code != 200:
            logger.error(f"Failed to get media URL: {response.status_code} - {response.text}")
            return None
            
        media_info = response.json()
        media_url = media_info.get('url')
        
        if not media_url:
            logger.error("No media URL in response")
            return None
            
        # Download media content
        media_response = requests.get(media_url, headers=headers, timeout=60)
        if media_response.status_code != 200:
            logger.error(f"Failed to download media: {media_response.status_code}")
            return None
            
        return media_response.content
        
    except Exception as e:
        logger.error(f"Error downloading WhatsApp media: {e}")
        return None

def process_voice_message(voice_msg):
    """Process WhatsApp voice message and return transcribed text"""
    try:
        # Extract media ID from voice message
        audio_id = voice_msg.get('audio', {}).get('id')
        if not audio_id:
            logger.error("No audio ID found in voice message")
            return None
            
        logger.info(f"Processing voice message with audio ID: {audio_id}")
        
        # Download audio from WhatsApp
        audio_data = download_whatsapp_media(audio_id)
        if not audio_data:
            logger.error("Failed to download audio data")
            return None
            
        logger.info(f"Downloaded audio data: {len(audio_data)} bytes")
        
        # Transcribe using ElevenLabs
        transcription_result = voice_service.transcribe_audio(audio_data, language_code="eng")
        
        if transcription_result:
            complaint_text = transcription_result['text'].strip()
            logger.info(f"Voice transcription successful: {complaint_text[:100]}...")
            return complaint_text
        else:
            logger.error("Voice transcription failed")
            return None
            
    except Exception as e:
        logger.error(f"Error processing voice message: {e}")
        logger.error(traceback.format_exc())
        return None

def process_complaint(msg_body, media_msg, from_number, location_msg=None, voice_msg=None):
    """Process a complaint from start to finish"""
    try:
        user_state = user_states.get(from_number, {
            'state': STATES['INIT'],
            'complaint_details': {}
        })
          # Check for status requests
        if msg_body and ('status' in msg_body.lower() or 'track' in msg_body.lower()):
            handle_status_request(msg_body, from_number)
            return
        
        # Check for history requests
        if msg_body and msg_body.lower().strip() in ['history', 'my complaints', 'complaints', 'all complaints']:
            handle_history_request(from_number)
            return
            
        # Check for cancel/abort requests - works at any stage
        if msg_body and msg_body.lower().strip() in ['cancel', 'abort', 'stop', 'quit', 'restart', 'reset', 'exit']:
            handle_cancel_request(from_number, user_state)
            return
            
        # Initialize user if first interaction
        if user_state['state'] == STATES['INIT']:
            user = get_user_by_phone(from_number)
            if not user:
                # TEMPORARY: Auto-create user for testing purposes
                # Remove this in production - users should register through the website
                logger.warning(f"🚧 TEMP: Auto-creating user for testing: {from_number}")
                try:
                    from services.db_service import create_user_admin
                    user = create_user_admin(from_number, f"User {from_number[-4:]}")
                    logger.info(f"✅ TEMP: Created test user: {user['id']}")
                except Exception as e:
                    logger.error(f"❌ Failed to create test user: {e}")
                    # More helpful registration message with debug info
                    logger.warning(f"🚫 Unregistered user attempted access: {from_number}")
                    send_reply(from_number, 
                        f"❌ Hello! I couldn't find your phone number ({from_number}) in our system.\n\n"
                        "To use this complaint system, you need to register first:\n"
                        "📱 Visit our website to register your phone number\n"
                        "🔗 After registration, return here to file complaints\n\n"                        "If you believe this is an error, please contact support.")
                    return
            
            user_state['user_id'] = user['id']
            send_reply(from_number, 
                "Hello! I'm Nirvana, here to help you lodge your complaint. Please describe the issue you're facing.\n\n"
                "💡 Available commands:\n"
                "• Type 'cancel' anytime to stop current process\n"
                "• Type 'history' to view all your complaints\n"
                "• Type 'status [ID]' to check specific complaint")
            user_state['state'] = STATES['DESCRIPTION']
            user_states[from_number] = user_state
            return
            
        # Collect complaint description
        if user_state['state'] == STATES['DESCRIPTION']:
            complaint_text = None
            
            if msg_body:
                complaint_text = msg_body
            elif voice_msg:
                # Handle voice message
                send_reply(from_number, "🎤 Processing your voice message... Please wait a moment.")
                
                try:
                    # Download and process voice message
                    complaint_text = process_voice_message(voice_msg)
                    if complaint_text:
                        send_reply(from_number, f"✅ Voice message transcribed: \"{complaint_text}\"")
                    else:
                        send_reply(from_number, 
                            "❌ Sorry, I couldn't process your voice message. Please try sending a text description instead.")
                        return
                except Exception as e:
                    logger.error(f"Error processing voice message: {e}")
                    send_reply(from_number, 
                        "❌ Sorry, there was an error processing your voice message. Please try sending a text description instead.")
                    return
            
            if complaint_text:
                # Analyze text with LLM to determine department and priority
                analysis = analyze_complaint_text(complaint_text)
                user_state['complaint_details'].update({
                    'description': complaint_text,
                    'department': analysis.get('department'),
                    'priority_score': analysis.get('priority_score', 0.5),                    'needs_image': analysis.get('needs_image', False)
                })
                
                send_reply(from_number, 
                    f"Thanks for the description! I've categorized this as a {analysis.get('department', 'general')} issue. "
                    "Now, please share your exact location using WhatsApp's location sharing feature.\n"
                    "📍 Tap the '+' button → Location → Send your current location\n\n"
                    "💡 Type 'cancel' anytime to stop this process")
                
                user_state['state'] = STATES['LOCATION']
                user_states[from_number] = user_state
            return

        # Collect and validate location
        if user_state['state'] == STATES['LOCATION']:
            location_data = None
            
            # Only handle WhatsApp location message - no text addresses
            if location_msg:
                location_data = {
                    'latitude': location_msg['location']['latitude'],
                    'longitude': location_msg['location']['longitude']
                }
                logger.info(f"Received location coordinates: {location_data}")
            elif msg_body:
                # Reject text input - only location sharing allowed
                send_reply(from_number, 
                    "❌ Please use WhatsApp's location sharing feature instead of typing an address.\n"
                    "📍 Tap the '+' button → Location → Send your current location")
                return
            
            if location_data:
                is_valid, validation_message = validate_location_format(location_data)
                if is_valid:
                    user_state['complaint_details']['location'] = location_data
                    
                    if user_state['complaint_details'].get('needs_image', False):
                        send_reply(from_number, 
                            f"✅ {validation_message}\n"
                            "This type of problem would benefit from photos. "
                            "Please send some pictures if possible, or type 'submit' to file without images.")
                    else:
                        send_reply(from_number, 
                            f"✅ {validation_message}\n"
                            "You can optionally add photos or more details, or type 'submit' to file the complaint now.")
                    
                    user_state['state'] = STATES['MEDIA_UPLOAD']
                    user_states[from_number] = user_state
                else:
                    send_reply(from_number, f"❌ {validation_message}")
            return

        # Handle media upload or confirmation
        if user_state['state'] == STATES['MEDIA_UPLOAD']:
            if media_msg:
                # Import here to avoid circular imports
                from services.media_service import process_image_message
                
                # Process image and store in database
                success = process_image_message(media_msg, from_number, user_states, is_complaint=True)
                if success:
                    # Validate image-text consistency if YOLO result is available
                    yolo_result = user_state['complaint_details'].get('yolo_result')
                    if yolo_result:
                        is_consistent, consistency_message = validate_image_text_consistency(
                            user_state['complaint_details']['description'], 
                            yolo_result
                        )
                        if not is_consistent:
                            send_reply(from_number, 
                                f"⚠️ {consistency_message}. Please ensure the image matches your complaint description or send a different image.")
                            return
                        else:
                            send_reply(from_number, 
                                f"✅ Image verified and matches your complaint! {consistency_message}. "
                                "Please confirm if you want to submit this complaint now by typing 'submit', "
                                "or send any additional details you'd like to add.")
                    else:
                        send_reply(from_number, 
                            "Image received and stored! Please confirm if you want to submit this complaint now by typing 'submit', "
                            "or send any additional details you'd like to add.")
                    
                    user_state['state'] = STATES['CONFIRMATION']
                    user_states[from_number] = user_state
                else:
                    send_reply(from_number, "There was an issue processing your image. Please try sending it again or type 'submit' to continue without an image.")
                return
            elif msg_body and msg_body.lower() in ['submit', 'confirm', 'yes']:
                # Submit complaint
                submit_complaint(from_number, user_state)
                return
            elif msg_body:
                # Add text details to complaint
                user_state['complaint_details']['description'] += f"\n\nAdditional details: {msg_body}"
                send_reply(from_number, 
                    "Details added. Type 'submit' when you're ready to file the complaint, "
                    "or continue sending more details or photos.")
                return

        # Handle final confirmation
        if user_state['state'] == STATES['CONFIRMATION']:
            if msg_body and msg_body.lower() in ['submit', 'confirm', 'yes']:
                submit_complaint(from_number, user_state)
            else:
                # Add more details if provided
                if msg_body:
                    user_state['complaint_details']['description'] += f"\n\nAdditional details: {msg_body}"
                send_reply(from_number, 
                    "Please confirm submission of your complaint by typing 'submit', "
                    "or continue sending more details.")

    except Exception as e:
        logger.error(f"Error processing complaint: {e}")
        logger.error(traceback.format_exc())
        send_reply(from_number, "Sorry, there was an error processing your complaint. Please try again.")
        user_states[from_number] = {
            'state': STATES['INIT'],
            'complaint_details': {}
        }

def submit_complaint(from_number, user_state):
    """Submit the complaint to the database"""
    try:
        # Get image data if available
        image_data = user_state['complaint_details'].get('image_data')
        image_url = None
        
        if image_data:
            # Use the public URL from the bucket storage
            image_url = image_data.get('public_url')
        
        # Extract location data
        location = user_state['complaint_details'].get('location')
        location_lat = None
        location_lng = None
        
        if location and isinstance(location, dict) and 'latitude' in location:
            location_lat = float(location['latitude'])
            location_lng = float(location['longitude'])
        
        # Use AI to enhance complaint details
        original_description = user_state['complaint_details']['description']
        department = user_state['complaint_details'].get('department')
        
        logger.info(f"🤖 Enhancing complaint with AI: {original_description[:50]}...")
        enhancement_result = enhance_complaint_details(
            text=original_description,
            department=department,
            location_data=location
        )
        
        # Extract enhanced details
        enhanced_title = enhancement_result.get('enhanced_title', f"Complaint from {from_number[-4:]}")
        enhanced_description = enhancement_result.get('enhanced_description', original_description)
        assigned_to = enhancement_result.get('assigned_to')
        
        logger.info(f"✅ AI Enhancement complete - Title: {enhanced_title[:60]}...")
          # Create complaint in database with enhanced details
        complaint = create_complaint(
            user_id=user_state['user_id'],
            title=enhanced_title,
            description=enhanced_description,
            image_url=image_url,
            category=department,
            priority_score=user_state['complaint_details'].get('priority_score'),
            location_lat=location_lat,
            location_lng=location_lng,
            assigned_to=assigned_to
        )
        
        # Send confirmation message with enhanced details
        severity_text = "High" if complaint['priority_score'] > 0.7 else "Medium" if complaint['priority_score'] > 0.4 else "Low"
        send_reply(from_number, 
            f"✅ Your complaint has been successfully logged with AI enhancement!\n\n"
            f"📋 Tracking ID: {complaint['id'][:8]}\n"
            f"📝 Title: {enhanced_title[:60]}{'...' if len(enhanced_title) > 60 else ''}\n"
            f"🏢 Department: {complaint.get('category', 'General')}\n"
            f"👤 Assigned to: {assigned_to or 'Auto-assignment pending'}\n"
            f"⚠️ Severity: {severity_text}\n"
            f"📅 Status: Submitted\n\n"
            f"We'll notify you of any updates. Check status anytime with 'status {complaint['id'][:8]}'!")
        
        # Clear user state
        user_states[from_number] = {
            'state': STATES['INIT'],
            'complaint_details': {}
        }
        
    except Exception as e:
        logger.error(f"Error submitting complaint: {e}")
        send_reply(from_number, "Sorry, there was an error submitting your complaint. Please try again.")

def handle_status_request(msg_body, from_number):
    """Handle status check requests"""
    try:
        # Get user's complaints
        user = get_user_by_phone(from_number)
        if not user:
            logger.warning(f"🚫 Unregistered user attempted status check: {from_number}")
            send_reply(from_number, 
                f"❌ Hello! I couldn't find your phone number ({from_number}) in our system.\n\n"
                "To check complaint status, you need to register first:\n"
                "📱 Visit our website to register your phone number\n"
                "🔗 After registration, return here to check your complaints\n\n"
                "If you believe this is an error, please contact support.")
            return
            
        complaints = get_user_complaints(user['id'])
        
        if not complaints:
            send_reply(from_number, "❌ You don't have any complaints on record. Type 'complaint' to file a new one.")
            return
        
        # If user provides specific ID, show that complaint
        words = msg_body.split()
        complaint_id = None
        for word in words:
            if len(word) >= 8:  # Assuming we use first 8 chars of UUID
                complaint_id = word
                break
        
        if complaint_id:
            # Find complaint by partial ID
            complaint = None
            for c in complaints:
                if str(c['id']).startswith(complaint_id):
                    complaint = c
                    break
            
            if complaint:
                severity_text = "High" if complaint['priority_score'] > 0.7 else "Medium" if complaint['priority_score'] > 0.4 else "Low"
                message = (
                    f"📋 Complaint Status\n\n"
                    f"🆔 ID: {complaint['id'][:8]}\n"
                    f"🏢 Department: {complaint.get('category', 'Not assigned')}\n"
                    f"⚠️ Severity: {severity_text}\n"
                    f"📅 Created: {complaint.get('created_at', 'Unknown')[:10] if complaint.get('created_at') else 'Unknown'}"
                )
            else:
                message = f"❌ No complaint found with ID: {complaint_id}"
        else:
            # Show all complaints
            message = f"📋 Your Complaints ({len(complaints)} total):\n\n"
            for i, complaint in enumerate(complaints[-5:], 1):  # Show last 5
                message += f"🆔 {complaint['id'][:8]} - {complaint.get('category', 'General')}\n"
            
            if len(complaints) > 5:
                message += f"\n... and {len(complaints) - 5} more."
            message += "\n\nSend 'status [ID]' for details on a specific complaint."
        
        send_reply(from_number, message)
        
    except Exception as e:
        logger.error(f"Error checking complaint status: {e}")
        send_reply(from_number, "Sorry, there was an error checking your complaint status. Please try again.")

def handle_history_request(from_number):
    """Handle history/all complaints requests"""
    try:
        # Get user by phone number
        user = get_user_by_phone(from_number)
        if not user:
            logger.warning(f"🚫 Unregistered user attempted history check: {from_number}")
            send_reply(from_number, 
                f"❌ Hello! I couldn't find your phone number ({from_number}) in our system.\n\n"
                "To view complaint history, you need to register first:\n"
                "📱 Visit our website to register your phone number\n"
                "🔗 After registration, return here to view your complaints\n\n"
                "If you believe this is an error, please contact support.")
            return
            
        # Get all user complaints
        complaints = get_user_complaints(user['id'])
        
        if not complaints:
            send_reply(from_number, 
                "📋 Complaint History\n\n"
                "❌ You don't have any complaints on record yet.\n\n"
                "💡 Type anything to start filing your first complaint!")
            return
        
        # Format complaint history message
        message = f"📋 Your Complaint History ({len(complaints)} total):\n\n"
        
        # Show all complaints with more details
        for i, complaint in enumerate(complaints, 1):
            severity_text = "High" if complaint['priority_score'] > 0.7 else "Medium" if complaint['priority_score'] > 0.4 else "Low"
            created_date = complaint.get('created_at', 'Unknown')[:10] if complaint.get('created_at') else 'Unknown'
            
            message += (
                f"{i}. 🆔 {complaint['id'][:8]}\n"
                f"   📝 {complaint.get('title', 'No title')[:50]}{'...' if len(complaint.get('title', '')) > 50 else ''}\n"
                f"   🏢 {complaint.get('category', 'General')} | ⚠️ {severity_text}\n"
                f"   📅 {created_date}\n\n"
            )
            
            # Limit to 10 complaints to avoid message being too long
            if i >= 10:
                remaining = len(complaints) - 10
                message += f"... and {remaining} more complaints.\n\n"
                break
        
        message += "💡 Send 'status [ID]' for details on a specific complaint."
        
        send_reply(from_number, message)
        
    except Exception as e:
        logger.error(f"Error checking complaint history: {e}")
        send_reply(from_number, "Sorry, there was an error retrieving your complaint history. Please try again.")

def handle_cancel_request(from_number, user_state):
    """Handle cancel/abort/stop requests during complaint process"""
    try:
        current_state = user_state.get('state', STATES['INIT'])
        
        # If user is already in INIT state, no need to cancel
        if current_state == STATES['INIT']:
            send_reply(from_number, 
                "ℹ️ You don't have any active complaint process to cancel.\n\n"
                "💡 Type anything to start filing a new complaint!\n"
                "📋 Type 'history' to view your past complaints.")
            return
        
        # Cancel the current complaint process
        logger.info(f"🚫 User {from_number} cancelled complaint process from state: {current_state}")
        
        # Clear user state - reset to initial state
        user_states[from_number] = {
            'state': STATES['INIT'],
            'complaint_details': {}
        }
        
        # Send confirmation message
        send_reply(from_number, 
            "✅ Your complaint process has been cancelled and reset.\n\n"
            "🔄 You can start a new complaint anytime by describing your issue.\n"
            "📋 Type 'history' to view your past complaints.\n"
            "📊 Type 'status' to check existing complaint status.\n\n"
            "How can I help you today?")
            
    except Exception as e:
        logger.error(f"Error handling cancel request: {e}")
        logger.error(traceback.format_exc())
        send_reply(from_number, 
            "❌ There was an error cancelling your complaint. Let me reset your session.\n"
            "Please try describing your complaint again.")
        
        # Force reset on error
        user_states[from_number] = {
            'state': STATES['INIT'],
            'complaint_details': {}
        }

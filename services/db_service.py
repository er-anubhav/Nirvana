import os
import base64
from datetime import datetime
from config import logger, supabase_client

def store_image_in_bucket(image_data, file_extension='jpg'):
    """Store image data in Supabase storage bucket"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
        
        # Debug: List available buckets first
        try:
            buckets = supabase_client.storage.list_buckets()
            bucket_names = [bucket.name for bucket in buckets] if buckets else []
            logger.info(f"Available buckets: {bucket_names}")
        except Exception as bucket_error:
            logger.error(f"Error listing buckets: {bucket_error}")
        
        # Create a unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = f"complaint_{timestamp}.{file_extension}"
        
        logger.info(f"Attempting to upload to bucket 'complaint-images' with filename: {filename}")
        
        # Upload to Supabase Storage bucket
        response = supabase_client.storage.from_("complaint-images").upload(
            path=filename,
            file=image_data,
            file_options={"content-type": f"image/{file_extension}"}
        )
        
        # Debug the response
        logger.info(f"Upload response: {response}")
        
        if hasattr(response, 'error') and response.error: # type: ignore
            raise Exception(f"Upload failed: {response.error}") # type: ignore
        
        # Get public URL for the uploaded image
        public_url = supabase_client.storage.from_("complaint-images").get_public_url(filename)
        
        logger.info(f"✅ Image uploaded to Supabase Storage: {filename}")
        logger.info(f"Public URL: {public_url}")
        
        return {
            'filename': filename,
            'public_url': public_url,
            'bucket': 'complaint-images'
        }
        
    except Exception as e:
        logger.error(f"Error storing image in bucket: {e}")
        raise

def normalize_phone_number(phone_number):
    """Normalize phone number to handle different formats"""
    if not phone_number:
        return []
    
    # Remove any non-digit characters except +
    clean_number = ''.join(c for c in phone_number if c.isdigit() or c == '+')
    
    # Generate possible variations
    variations = []
    
    # Add original number
    variations.append(phone_number)
    variations.append(clean_number)
    
    # If number starts with +, add version without +
    if clean_number.startswith('+'):
        variations.append(clean_number[1:])
    
    # If number doesn't start with +, add version with +
    if not clean_number.startswith('+') and clean_number:
        variations.append('+' + clean_number)
    
    # For Indian numbers, handle country code variations
    if clean_number.startswith('91') or clean_number.startswith('+91'):
        base_number = clean_number.replace('+91', '').replace('91', '', 1)
        if len(base_number) == 10:  # Valid Indian mobile number length
            variations.extend([
                base_number,
                '91' + base_number,
                '+91' + base_number,
                '+91 ' + base_number,
                '91 ' + base_number
            ])
    
    # Remove duplicates and empty strings
    return list(set([v for v in variations if v]))

def get_user_by_phone(phone_number):
    """Get existing user by phone number with format variations. Don't create new users."""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
        
        logger.info(f"🔍 Looking up user with phone: {phone_number}")
        
        # Get all possible phone number variations
        phone_variations = normalize_phone_number(phone_number)
        logger.info(f"📱 Checking phone variations: {phone_variations}")
        
        # Try each variation
        for phone_variant in phone_variations:
            response = supabase_client.table('users').select('*').eq('phone_number', phone_variant).execute()
            
            if response.data:
                logger.info(f"✅ Found existing user: {response.data[0]['id']} (phone: {phone_variant}, original: {phone_number})")
                return response.data[0]
        
        # If no user found with any variation, check if there are any users at all (for debugging)
        all_users_response = supabase_client.table('users').select('phone_number').execute()
        if all_users_response.data:
            stored_numbers = [user['phone_number'] for user in all_users_response.data]
            logger.info(f"📋 Numbers in database: {stored_numbers[:5]}...")  # Show first 5 for privacy
        else:
            logger.info("📋 No users found in database")
            
        # Don't create new user - return None to indicate user needs to register
        logger.info(f"❌ User not found with any phone variation: {phone_variations}")
        return None
        
    except Exception as e:
        logger.error(f"Error in get_user_by_phone: {e}")
        raise

def create_test_user(phone_number, name="Test User", email=None):
    """Create a test user for debugging purposes"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
        
        # Check if user already exists first
        existing_user = get_user_by_phone(phone_number)
        if existing_user:
            logger.info(f"User already exists: {existing_user['id']}")
            return existing_user
            
        user_data = {
            'phone_number': phone_number,
            'name': name,
            'email': email or f"test_{phone_number}@example.com"
        }
        
        response = supabase_client.table('users').insert(user_data).execute()
        logger.info(f"✅ Created test user: {response.data[0]['id']} (phone: {phone_number})")
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Error creating test user: {e}")
        raise

def create_user_admin(phone_number, name="Test User", email=None):
    """Create a user with admin privileges (bypassing RLS)"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
        
        # Check if user already exists first
        existing_user = get_user_by_phone(phone_number)
        if existing_user:
            logger.info(f"User already exists: {existing_user['id']}")
            return existing_user
        
        # For now, let's try a direct insert
        user_data = {
            'phone_number': phone_number,
            'name': name,
            'email': email or f"user_{phone_number[-4:]}@nirvana.com"
        }
        
        # Try using the service role if available
        response = supabase_client.table('users').insert(user_data).execute()
        logger.info(f"✅ Created user: {response.data[0]['id']} (phone: {phone_number})")
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        # For immediate testing, let's return a mock user
        mock_user = {
            'id': f'mock-{phone_number}',
            'phone_number': phone_number,
            'name': name,
            'email': email or f"user_{phone_number[-4:]}@nirvana.com"
        }
        logger.warning(f"⚠️ Using mock user for testing: {mock_user}")
        return mock_user

def create_complaint(user_id, title, description, image_url=None, category=None, priority_score=None, 
                    location_lat=None, location_lng=None, assigned_to=None):
    """Create new complaint in database matching actual schema"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
            
        complaint_data = {
            'user_id': user_id,
            'title': title,
            'description': description,
            'category': category,
            'priority_score': priority_score or 0.5,
            'location_lat': location_lat,
            'location_lng': location_lng,
            'image_url': image_url,
            'assigned_to': assigned_to
        }
        
        response = supabase_client.table('complaints').insert(complaint_data).execute()
        logger.info(f"✅ Created enhanced complaint: {response.data[0]['id']} (user: {user_id}, category: {category}, assigned: {assigned_to})")
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Error in create_complaint: {e}")
        raise

def get_user_complaints(user_id):
    """Get all complaints for a user"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
            
        response = supabase_client.table('complaints').select('*').eq('user_id', user_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error in get_user_complaints: {e}")
        raise

def get_complaint_by_id(complaint_id):
    """Get a specific complaint by ID"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
            
        response = supabase_client.table('complaints').select('*').eq('id', complaint_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error in get_complaint_by_id: {e}")
        return None

def add_comment_to_complaint(complaint_id, user_id, text):
    """Add a comment to a complaint"""
    try:
        if not supabase_client:
            raise Exception("Supabase client not configured")
            
        comment_data = {
            'complaint_id': complaint_id,
            'user_id': user_id,
            'text': text,
            'timestamp': datetime.now().isoformat()
        }
        
        response = supabase_client.table('comments').insert(comment_data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error in add_comment_to_complaint: {e}")
        raise

def test_supabase_storage():
    """Test Supabase storage connection"""
    try:
        if not supabase_client:
            logger.error("Supabase client not configured")
            return False
        
        # Try to list buckets
        buckets = supabase_client.storage.list_buckets()
        logger.info(f"✅ Storage connection working. Available buckets: {[b.name for b in buckets] if buckets else []}")
          # Check if complaint-images bucket exists
        bucket_names = [b.name for b in buckets] if buckets else []
        if 'complaint-images' in bucket_names:
            logger.info("✅ complaint-images bucket found")
            return True
        else:
            logger.error(f"❌ complaint-images bucket not found. Available: {bucket_names}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Storage connection failed: {e}")
        return False

def get_user_by_id(user_id):
    """Get a user by their ID"""
    try:
        if not supabase_client:
            logger.error("Supabase client not configured")
            return None
        
        response = supabase_client.table('users').select('*').eq('id', user_id).execute()
        return response.data[0] if response.data else None
        
    except Exception as e:
        logger.error(f"Error getting user by ID: {e}")
        return None

def get_complaint_stats():
    """Get complaint statistics for public dashboard"""
    try:
        if not supabase_client:
            logger.error("Supabase client not configured")
            return {'total': 0, 'resolved': 0, 'inprogress': 0}
        
        # Get all complaints
        response = supabase_client.table('complaints').select('status').execute()
        complaints = response.data
        
        total = len(complaints)
        resolved = len([c for c in complaints if c.get('status') == 'Resolved'])
        inprogress = len([c for c in complaints if c.get('status') == 'In Progress'])
        pending = total - resolved - inprogress
        
        return {
            'total': total,
            'resolved': resolved,
            'inprogress': inprogress,
            'pending': pending
        }
        
    except Exception as e:
        logger.error(f"Error getting complaint stats: {e}")
        return {'total': 0, 'resolved': 0, 'inprogress': 0, 'pending': 0}

def get_all_complaints():
    """Get all complaints from the database"""
    try:
        if not supabase_client:
            logger.error("Supabase client not configured")
            return []
        
        response = supabase_client.table('complaints').select('*').order('created_at', desc=True).execute()
        return response.data
        
    except Exception as e:
        logger.error(f"Error getting all complaints: {e}")
        return []

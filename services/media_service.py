import os
import requests
from datetime import datetime
import traceback
import base64
from config import logger, ACCESS_TOKEN
from models.yolo_model import categorize_image_with_yolo, yolo_model
from services.whatsapp_service import send_reply
from services.db_service import store_image_in_bucket

def get_media_url(media_id):
    url = f"https://graph.facebook.com/v18.0/{media_id}"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

    try:
        response = requests.get(url, headers=headers, timeout=30)

        if response.status_code != 200:
            logger.error(f"Failed to get media URL: {response.status_code} - {response.text}")
            return None

        data = response.json()
        media_url = data.get('url')

        if not media_url:
            logger.error("No URL in media response")
            return None

        logger.info(f"Successfully got media URL for {media_id}")
        return media_url

    except requests.exceptions.Timeout:
        logger.error("Timeout getting media URL")
        return None
    except Exception as e:
        logger.error(f"Error getting media URL: {e}")
        return None

def download_media(media_url):
    """
    Download media content from a URL.
    
    Args:
        media_url (str): The URL to download from
        
    Returns:
        bytes: The downloaded content, or None on failure
    """
    if not media_url:
        return None

    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

    try:
        response = requests.get(media_url, headers=headers, timeout=60)

        if response.status_code != 200:
            logger.error(f"Failed to download media: {response.status_code}")
            return None

        content = response.content
        if len(content) == 0:
            logger.error("Downloaded empty file")
            return None

        logger.info(f"Successfully downloaded media, size: {len(content)} bytes")
        return content

    except requests.exceptions.Timeout:
        logger.error("Timeout downloading media")
        return None
    except Exception as e:
        logger.error(f"Error downloading media: {e}")
        return None

def process_image_message(msg, from_number, user_states, is_complaint=False):
    """
    Process an image message from WhatsApp and store it directly in the database.
    
    Args:
        msg (dict): The message data from WhatsApp
        from_number (str): The sender's phone number
        user_states (dict): The user state dictionary
        is_complaint (bool): Whether this image is part of a complaint
        
    Returns:
        bool: True if processing was successful, False otherwise
    """
    try:
        media_id = msg['image']['id']
        logger.info(f"Processing image with media_id: {media_id}")

        image_url = get_media_url(media_id)
        if not image_url:
            send_reply(from_number, "Sorry, I couldn't access your image. Please try sending it again.")
            return False

        image_data = download_media(image_url)
        if not image_data:
            send_reply(from_number, "Sorry, I couldn't download your image. Please try sending it again.")
            return False

        try:
            if is_complaint:
                # First, analyze image with YOLO for spam detection
                yolo_result = None
                if yolo_model:
                    # Save temporary file for YOLO analysis
                    temp_filename = f"temp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                    temp_path = os.path.join(os.getcwd(), temp_filename)
                    
                    try:
                        with open(temp_path, 'wb') as f:
                            f.write(image_data)
                        
                        # Analyze with YOLO
                        yolo_result = categorize_image_with_yolo(temp_path)
                        logger.info(f"YOLO analysis result: {yolo_result}")
                        
                        # Check for spam
                        from models.llm_model import is_spam_image
                        is_spam, spam_reason = is_spam_image(yolo_result)
                        
                        if is_spam:
                            logger.warning(f"Spam image detected: {spam_reason}")
                            send_reply(from_number, f"❌ {spam_reason}. Please send images related to your complaint.")
                            return False
                        
                    finally:
                        # Clean up temporary file
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                
                # Store image data for complaint in Supabase Storage bucket
                image_info = store_image_in_bucket(image_data, 'jpg')
                user_states[from_number]['complaint_details']['image_data'] = image_info
                user_states[from_number]['complaint_details']['yolo_result'] = yolo_result
                logger.info(f"✅ Complaint image stored in Supabase bucket: {image_info['filename']}")
                
                # Provide feedback based on YOLO analysis
                if yolo_result:
                    send_reply(from_number, f"📷 Image received and analyzed: {yolo_result}. You can now submit your complaint or add more details.")
                else:
                    send_reply(from_number, "📷 Image received and stored! You can now submit your complaint or add more details.")
            else:
                # For non-complaint images, provide helpful response
                send_reply(from_number, "📷 Image received! To lodge a complaint, please first describe your issue in detail.")
                logger.info(f"Non-complaint image received from {from_number}")

        except Exception as e:
            logger.error(f"Failed to process image: {e}")
            send_reply(from_number, "Sorry, there was an error processing your image. Please try again.")
            return False

        return True

    except Exception as e:
        logger.error(f"Error in process_image_message: {e}")
        logger.error(traceback.format_exc())
        send_reply(from_number, "❌ An unexpected error occurred. Please try again.")
        return False

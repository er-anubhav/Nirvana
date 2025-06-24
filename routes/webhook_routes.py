import traceback
import json
from flask import request
from config import logger, VERIFY_TOKEN
from services.whatsapp_service import send_reply, process_complaint
from services.media_service import process_image_message

def register_webhook_routes(app):
    @app.route('/', methods=['GET', 'POST', 'HEAD'])
    def webhook():
        logger.info(f"Webhook called with method: {request.method}")

        # Handle HEAD requests (needed for server health checks)
        if request.method == 'HEAD':
            logger.info("HEAD request received - responding with 200 OK")
            return '', 200
            
        if request.method == 'GET':
            token = request.args.get('hub.verify_token')
            challenge = request.args.get('hub.challenge')
            mode = request.args.get('hub.mode')
            
            logger.info(f"Verification attempt - mode: {mode}, token match: {token == VERIFY_TOKEN}")

            if mode == 'subscribe' and token == VERIFY_TOKEN:
                logger.info("Webhook verification successful")
                return challenge, 200

            logger.error("Webhook verification failed")
            return 'Verification failed', 403

        if request.method == 'POST':
            try:
                # Log the content type to help with debugging
                content_type = request.headers.get('Content-Type', '')
                logger.info(f"POST request received with Content-Type: {content_type}")
                
                # Parse the request data based on content type
                data = {}
                
                if content_type and 'application/json' in content_type:
                    try:
                        data = request.get_json(silent=True) or {}
                        logger.info("Successfully parsed JSON data")
                    except Exception as e:
                        logger.error(f"Error parsing JSON: {e}")
                        return 'OK', 200
                elif request.form:
                    data = dict(request.form)
                    logger.info(f"Parsed form data: {data}")
                elif request.data:
                    try:
                        data = json.loads(request.data)
                        logger.info("Successfully parsed raw data as JSON")
                    except:
                        # Log the raw data for troubleshooting
                        raw_data = request.data.decode('utf-8', errors='ignore')
                        logger.warning(f"Could not parse raw data as JSON: {raw_data[:500]}...")
                        return 'OK', 200
                
                # Log parsed data for debugging
                logger.info(f"Parsed data: {str(data)[:500]}...")
                
                # Check if we have the expected data structure
                if not data or 'entry' not in data:
                    logger.info("Missing 'entry' field in data - returning OK")
                    return 'OK', 200

                entry = data.get('entry', [])
                if not entry or not isinstance(entry, list) or len(entry) == 0:
                    logger.info("Empty entry list - returning OK")
                    return 'OK', 200
                
                # Make sure the first entry is a dictionary
                if not isinstance(entry[0], dict):
                    logger.warning(f"Entry is not a dictionary: {entry[0]}")
                    return 'OK', 200

                # Process the changes
                changes = entry[0].get('changes', [])
                if not changes or not isinstance(changes, list) or len(changes) == 0:
                    logger.info("No changes found - returning OK")
                    return 'OK', 200

                value = changes[0].get('value', {})
                if not isinstance(value, dict):
                    logger.warning(f"Value is not a dictionary: {value}")
                    return 'OK', 200
                    
                messages = value.get('messages', [])
                if not messages or not isinstance(messages, list) or len(messages) == 0:
                    logger.info("No messages in webhook data")
                    return 'OK', 200

                msg = messages[0]
                from_number = msg.get('from')
                msg_type = msg.get('type')
                
                if not from_number or not msg_type:
                    logger.warning(f"Missing required fields in message: {msg}")
                    return 'OK', 200

                logger.info(f"Processing message from {from_number}, type: {msg_type}")
                
                # Extract message content based on type
                msg_body = None
                media_msg = None
                location_msg = None
                voice_msg = None
                
                if msg_type == 'text':
                    text_data = msg.get('text', {})
                    if isinstance(text_data, dict) and 'body' in text_data:
                        msg_body = text_data.get('body')
                        logger.info(f"User {from_number} text message: '{msg_body}'")
                    else:
                        logger.warning(f"Invalid text message format: {text_data}")
                        return 'OK', 200
                elif msg_type == 'image':
                    media_msg = msg
                    logger.info(f"User {from_number} sent an image")
                elif msg_type == 'location':
                    location_msg = msg
                    logger.info(f"User {from_number} sent a location")
                elif msg_type == 'audio':
                    voice_msg = msg
                    logger.info(f"User {from_number} sent an audio message")
                else:
                    send_reply(from_number, "I can process text messages, images, audio messages, and location. Please describe your complaint, send photos/audio, or share your location.")
                    logger.info(f"Received unhandled message type: {msg_type} from {from_number}")
                    return 'OK', 200
                
                # Process complaint using our new system
                process_complaint(msg_body, media_msg, from_number, location_msg, voice_msg)
                return 'OK', 200

            except Exception as e:
                logger.error(f"Error processing webhook: {e}")
                logger.error(traceback.format_exc())
                return 'Error', 500

        # Default response for any other method
        return 'Method not allowed', 405

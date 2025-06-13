import traceback
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
                data = request.json
                logger.info("POST request received")

                if not data or 'entry' not in data:
                    logger.info("Empty webhook data - returning OK")
                    return 'OK', 200

                entry = data.get('entry', [])
                if not entry:
                    return 'OK', 200

                changes = entry[0].get('changes', [])
                if not changes:
                    return 'OK', 200

                value = changes[0].get('value', {})
                messages = value.get('messages')
                
                if not messages:
                    logger.info("No messages in webhook data")
                    return 'OK', 200

                msg = messages[0]
                from_number = msg['from']
                msg_type = msg['type']

                logger.info(f"Processing message from {from_number}, type: {msg_type}")
                # Extract message content based on type
                msg_body = None
                media_msg = None
                location_msg = None
                voice_msg = None
                
                if msg_type == 'text':
                    msg_body = msg['text']['body']
                    logger.info(f"User {from_number} text message: '{msg_body}'")
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

            # This return should never be reached but adding as a safeguard
            return 'OK', 200

import traceback
from flask import Flask
from flask_cors import CORS

from config import (
    logger, VERIFY_TOKEN, 
    gemini_configured, elevenlabs_configured
)

from models.yolo_model import model_loaded, yolo_model

from routes.webhook_routes import register_webhook_routes
from routes.web_routes import web_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Enable template auto-reloading in development
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    
    # Add no-cache headers to all responses
    @app.after_request
    def add_no_cache_headers(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
        response.headers["Expires"] = "0"
        response.headers["Pragma"] = "no-cache"
        return response
    
    # Add a simple health check route
    @app.route('/health', methods=['GET', 'HEAD'])
    def health_check():
        return 'OK', 200
    
    register_webhook_routes(app)
    app.register_blueprint(web_bp)
    
    return app

if __name__ == '__main__':
    import os
    
    # Get port from environment variable for compatibility with Render and other cloud platforms
    port = int(os.environ.get('PORT', 5000))
    
    logger.info("="*50)
    logger.info("Starting WhatsApp Chatbot with LLM & Image Processing")
    logger.info(f"YOLO Model Loaded: {yolo_model is not None}")
    logger.info(f"Gemini AI Configured: {gemini_configured}")
    logger.info(f"ElevenLabs Voice Configured: {elevenlabs_configured}")
    logger.info(f"Verify Token: {VERIFY_TOKEN}")
    logger.info(f"Server starting on host='0.0.0.0', port={port}")
    logger.info("="*50)

    app = create_app()
    
    try:
        app.run(host='0.0.0.0', port=port, debug=False)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        logger.error(traceback.format_exc())

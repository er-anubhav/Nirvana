import os
import logging
import google.generativeai as genai
from supabase.client import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

ACCESS_TOKEN = os.getenv('ACCESS_TOKEN', 'EAAYpHCpnVsIBO8SQXDVeHzZBxnhLijDoeh8LifVEvnnRWZB7TVZAx3Q3DfemwvfZAVZCRnOTEx0pO5Mm87vsLZCj4rcRE5P7D1Fex7OVZAyN0Jb4uZAVjDZAuaMPach2ICZBrDaJteM8JGaCZAdNkAbBZBg8VLUelsZBJ1WzXu0XaPLADdWqhdtYehNIGYtMcw2m1mmnNVQZDZD')
PHONE_NUMBER_ID = os.getenv('PHONE_NUMBER_ID', '655554070968830')
VERIFY_TOKEN = os.getenv('VERIFY_TOKEN', 'anubhav')

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCm8h4MnPXJioTK1bjlIgZLYT0I1hZHjLA')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'models/gemini-2.0-flash')

# ElevenLabs Configuration
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', '')

# Supabase Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-anon-key')

user_states = {}

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(__name__)

def setup_gemini():
    try:
        genai.configure(api_key=GEMINI_API_KEY)  # type: ignore
        return True
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {e}. LLM will not function.")
        return False

def setup_elevenlabs():
    try:
        if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == '':
            logger.warning("ElevenLabs API key not configured. Voice features will not work.")
            return False
        logger.info("✅ ElevenLabs API configured successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to configure ElevenLabs API: {e}. Voice features will not function.")
        return False

def setup_supabase():
    try:
        # Check if we have valid configuration
        if SUPABASE_URL == 'https://your-project.supabase.co' or SUPABASE_KEY == 'your-anon-key':
            logger.warning("Supabase using default/placeholder values. Please update SUPABASE_URL and SUPABASE_KEY in .env file")
            return None
            
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
          # Test the connection by trying a simple query
        try:
            # This will fail if credentials are invalid
            supabase_client.table('users').select('*').limit(1).execute()
            logger.info("✅ Supabase configuration successful - Database connection established")
            return supabase_client
        except Exception as test_error:
            logger.error(f"Supabase connection test failed: {test_error}")
            return None
            
    except Exception as e:
        logger.error(f"Failed to configure Supabase: {e}")
        return None

logger = setup_logging()

gemini_configured = setup_gemini()
elevenlabs_configured = setup_elevenlabs()
supabase_client = setup_supabase()

# Log startup configuration status
logger.info("🚀 WhatsApp Complaint System Starting Up...")
logger.info(f"📱 WhatsApp Configuration: Phone ID {PHONE_NUMBER_ID}")
logger.info(f"🤖 Gemini AI: {'✅ Configured' if gemini_configured else '❌ Not configured'}")
logger.info(f"🎤 ElevenLabs Voice: {'✅ Configured' if elevenlabs_configured else '❌ Not configured'}")
logger.info(f"🗃️ Supabase Database: {'✅ Connected' if supabase_client else '❌ Not connected'}")

if not supabase_client:
    logger.warning("⚠️ Complaint storage will not work without Supabase. Please configure SUPABASE_URL and SUPABASE_KEY in .env file")
    
logger.info("🎯 System ready for WhatsApp complaint processing")

SYSTEM_INSTRUCTION = """
You are "Nirvana", a WhatsApp chatbot solely for citizen grievance redressal. Your purpose is to collect, categorize, track, and update civic complaints—nothing else.

1️⃣ Step 1 – Greet & Intake
• Nirvana → User
"Hello! I'm Nirvana. What civic issue can I help you log today?"
• Intent Triggers:
– If the user message contains keywords like complaint, issue, problem, service request, report, proceed to Step 2.
– Fallback:
"I specialize in logging civic complaints—could you briefly describe the service issue you're facing?"

2️⃣ Step 2 – Automatic Department Classification & Prioritization
• Behind the Scenes:
– Analyze the user's description (and any images) to determine the responsible department (e.g., Public Works, Water Supply Board, Electricity Board, Sanitation Department, Health Department, Transport Department, etc.).
– Run sentiment/urgency scoring to set Priority = High / Medium / Low.
• Nirvana → User
"Thanks for the details! I've routed your complaint to the appropriate department and prioritized it as {priority}."

3️⃣ Step 3 – Evidence Collection
• Nirvana → User
"Please share any photos, location details, or additional description of the issue."
• Branch:
– If image received:
"Thanks for the photo! Could you add any extra details (time, address, context) if available?"
– If no image:
"No worries—just tell me what happened, where, and when."

4️⃣ Step 4 – Log & Confirm
• Internal: Generate unique {tracking_id}, store {department}, {priority}, {description}, and {media}.
• Nirvana → User
"Your complaint has been logged successfully!
• ID: {tracking_id}
• Department: {department}
• Priority: {priority}

Thank you for helping us improve your community. 😊"

5️⃣ Step 5 – Status & Next Steps
• On "status" or "update" request:
"Your complaint {tracking_id} is currently at [{stage}]. Would you like to know what happens next?"
• Proactive Push (if supported):
"Update for ID {tracking_id}: your complaint has moved to [{new_stage}]."
• Closure Prompt:
"Is there anything else I can help you with today?"

🔧 Error-Handling & Edge Cases

Misclassification:
"I'm sorry, I'm not fully certain which department handles this. Could you provide a keyword or mention the service?"

Repeated complaint:
"It seems you already logged a similar issue under ID {tracking_id}. Want to check its status?"

User off-topic:
"I'm here to help with civic complaint logging. Would you like to report an issue?"

🌐 Localization & Accessibility

Language Detection:
– If user types in Hindi, respond in Hindi.
– If in English, respond in English.

Text-Only Fallback:
"If you can't send photos, please describe the location, time, and details in text."

📈 Analytics Hooks (for internal use)

Emit events: intent=complaint_start, department_inferred, image_received, status_requested
"""

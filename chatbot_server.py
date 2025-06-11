import random
import requests
from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "civil_chatbot_secret"
CORS(app, supports_credentials=True)

# Define possible responses for each intent
RESPONSES = {
    "greeting": [
        "Hello! How can I assist you with your civil issue today?",
        "Hi there! What civil problem can I help you with?",
        "Greetings! Feel free to ask about any civil matter."
    ],
    "chatbot_definition": [
        "A chatbot is a computer program designed to simulate conversation with humans.",
        "Chatbots are virtual assistants that can answer your questions automatically.",
        "A chatbot helps users by providing automated responses to their queries."
    ],
    "chatbot_work": [
        "Chatbots work by analyzing your questions and responding based on programmed logic or AI.",
        "They process your input and try to give the most relevant answer.",
        "By matching your queries to known patterns, chatbots provide helpful responses."
    ],
    "civil_problem_intro": [
        {
            "reply": "Please select a category for your query:",
            "options": [
                "Complaint Submission",
                "Complaint Status & Tracking",
                "Types of Issues Handled",
                "Account & Registration",
                "Location & Jurisdiction",
                "Fake or Duplicate Complaints",
                "Response & Resolution Process",
                "Complaint Modification or Deletion",
                "User Support & Feedback",
                "Legal or Escalation Queries",
                "Language & Accessibility",
                "Awareness & Education",
                "Other"
            ]
        }
    ],
    "Complaint Submission": [
        {
            "reply": "Select your question:",
            "options": [
                "How can I file a new complaint?",
                "What details do I need to submit a complaint?",
                "Can I upload images with my complaint?",
                "Is there a mobile app to file complaints?"
            ]
        }
    ],
    "Complaint Status & Tracking": [
        {
            "reply": "Select your question:",
            "options": [
                "How can I check the status of my complaint?",
                "My complaint ID is not working, what should I do?",
                "How long does it take to resolve a complaint?",
                "Will I be notified when my complaint is resolved?"
            ]
        }
    ],
    "Types of Issues Handled": [
        {
            "reply": "Select your question:",
            "options": [
                "What types of civic issues can I report?",
                "Can I report illegal construction?",
                "Do you accept complaints about stray animals?",
                "Can I complain about power outages?"
            ]
        }
    ],
    "Account & Registration": [
        {
            "reply": "Select your question:",
            "options": [
                "How do I create an account?",
                "I forgot my password, how do I reset it?",
                "Can I file a complaint without registering?",
                "Is my data safe on this platform?"
            ]
        }
    ],
    "Location & Jurisdiction": [
        {
            "reply": "Select your question:",
            "options": [
                "Which areas are covered by this website?",
                "Can I report a problem in a different district?",
                "How do I mark the location of the problem?"
            ]
        }
    ],
    "Fake or Duplicate Complaints": [
        {
            "reply": "Select your question:",
            "options": [
                "What happens if someone files a fake complaint?",
                "Can I report a duplicate or spam complaint?",
                "How do you verify the authenticity of complaints?"
            ]
        }
    ],
    "Response & Resolution Process": [
        {
            "reply": "Select your question:",
            "options": [
                "Who handles the complaint after I submit it?",
                "How are complaints prioritized?",
                "Will I get feedback on the resolution?"
            ]
        }
    ],
    "Complaint Modification or Deletion": [
        {
            "reply": "Select your question:",
            "options": [
                "Can I edit my complaint after submitting?",
                "I entered wrong details—how do I correct them?",
                "Can I delete my complaint?"
            ]
        }
    ],
    "User Support & Feedback": [
        {
            "reply": "Select your question:",
            "options": [
                "How do I contact support?",
                "I have suggestions to improve the site. Where can I share them?",
                "Where can I give feedback on complaint resolution?"
            ]
        }
    ],
    "Legal or Escalation Queries": [
        {
            "reply": "Select your question:",
            "options": [
                "Can I escalate my complaint if it’s not resolved?",
                "What are my legal rights if the problem persists?",
                "Can I use this complaint record in court?"
            ]
        }
    ],
    "Language & Accessibility": [
        {
            "reply": "Select your question:",
            "options": [
                "Is the website available in regional languages?",
                "Is there a text-to-speech or accessibility feature?"
            ]
        }
    ],
    "Awareness & Education": [
        {
            "reply": "Select your question:",
            "options": [
                "Why should I report civic problems?",
                "What happens after a problem is reported?",
                "How can I help spread awareness about civic reporting?"
            ]
        }
    ],
    "other": [
        "Please describe your civil problem in detail, and I will try to assist you.",
        "Kindly provide more information about your issue."
    ],
    "default": [
        "I'm here to help with civil law questions like property, family, or contract issues. Please ask your question.",
        "Sorry, I didn't understand. Could you please rephrase or provide more details about your civil problem?",
        "I can answer questions about civil law matters. Please specify your issue."
    ]
}

OPTION_MAP = {
    "Complaint Submission": ("Complaint Submission", []),
    "Complaint Status & Tracking": ("Complaint Status & Tracking", []),
    "Types of Issues Handled": ("Types of Issues Handled", []),
    "Account & Registration": ("Account & Registration", []),
    "Location & Jurisdiction": ("Location & Jurisdiction", []),
    "Fake or Duplicate Complaints": ("Fake or Duplicate Complaints", []),
    "Response & Resolution Process": ("Response & Resolution Process", []),
    "Complaint Modification or Deletion": ("Complaint Modification or Deletion", []),
    "User Support & Feedback": ("User Support & Feedback", []),
    "Legal or Escalation Queries": ("Legal or Escalation Queries", []),
    "Language & Accessibility": ("Language & Accessibility", []),
    "Awareness & Education": ("Awareness & Education", []),
    "Other": ("other", [])
}

# Remove Gemini API usage and rely strictly on custom answers

CUSTOM_ANSWERS = {
    "How can I file a new complaint?": [
        "Just send a WhatsApp message or SMS from your phone—no login or app required. You can report issues anytime using your mobile number. Our chatbot replies to confirm receipt.",
        "Shoot us a message with the problem, and we’ll take it from there—no signup needed.",
        "Use our app or website to file as well; it’s tied to your phone number, not an account.",
        "Whether via app, WhatsApp, or SMS—filing is easy and all linked to your mobile."
    ],
    "What details do I need to submit a complaint?": [
        "Provide a clear description of the issue, along with location. Adding an image helps us validate faster. That’s really all we need to start action.",
        "Just tell us what’s wrong, where it is, and send a photo if you can.",
        "A few lines of description, GPS or address, and an image—simple and effective. It makes it easier for the team to address the problem.",
        "Description, photo, and location: that’s the core info we need to open a ticket."
    ],
    "Can I upload images with my complaint?": [
        "Absolutely—attach a photo via WhatsApp, SMS, or the app to assist us.",
        "Yes, adding an image speeds up the validation and resolution process.",
        "Images aren’t mandatory, but they’re a huge help to local authorities.",
        "You can upload pictures directly in the app or message—you’ll get faster action."
    ],
    "Is there a mobile app to file complaints?": [
        "Yes, our official mobile app lets you submit, track, and review complaints.",
        "Download the app for a smooth, mobile-native experience and live updates.",
        "Besides WhatsApp/SMS, the app adds features like pinning location and uploading images.",
        "Our app ties into the same system—use it alongside chat options for convenience."
    ],
    "How can I check the status of my complaint?": [
        "Visit our website and enter your phone number to see your complaint’s latest status.",
        "Use the app or site—just input your mobile number to get real-time updates.",
        "Status updates are tied to your number, and you’ll be notified automatically upon resolution.",
        "No login, just your phone number. You can check or revisit progress anytime."
    ],
    "My complaint ID is not working, what should I do?": [
        "Make sure you entered exactly the same mobile number you used to file. If it still fails, drop us an email—our support team will look into it.",
        "Try refreshing the page or app and re-entering your number.",
        "Double-check the digits and retry. If it doesn’t work, contact support.",
        "If you're still facing issues, write to our support email with your number and screenshot."
    ],
    "How long does it take to resolve a complaint?": [
        "Resolution time varies—simple issues may be fixed in hours, while complex ones take days.",
        "Based on category and urgency, we prioritize faster action for severe problems.",
        "Typical turnaround is 1–3 days, but emergencies like open manholes get immediate attention.",
        "You can check the dashboard for an estimated resolution time based on similar past cases."
    ],
    "Will I be notified when my complaint is resolved?": [
        "Yes, you’ll get an automatic notification once it’s marked resolved.",
        "We’ll send a confirmation message, and you can view closure details online.",
        "Resolution alerts come via SMS or WhatsApp, and you can check the dashboard too.",
        "Keep an eye out—you’ll receive a message and see an update in the app or website."
    ],
    "What types of civic issues can I report?": [
        "We accept complaints about garbage, potholes, open manholes, sewage, and streetlights. Also illegal graffiti, water supply, traffic jams, air pollution, and more. We're adding even more categories soon.",
        "From potholes and broken lights to garbage dump and tree cutting—our system covers it all.",
        "Civic concerns like sewage leaks, water issues, open drains, and graffiti are included.",
        "Our current focus includes sanitation, public safety, and environmental issues across India."
    ],
    "Can I report illegal construction?": [
        "Not yet—but we plan to introduce this category in an upcoming update.",
        "Construction violations aren't supported currently, but keep an eye out for future additions.",
        "We know it’s important—illegal construction is already on our roadmap.",
        "Not available at the moment, but it's something we'll roll out soon."
    ],
    "Do you accept complaints about stray animals?": [
        "Animal-related issues aren’t supported yet, but we’re considering them.",
        "Stray animal reports are not available now, but may be included soon.",
        "Not currently supported, but we appreciate your input for future expansion.",
        "It’s a recognized need—watch for this category in future versions."
    ],
    "Can I complain about power outages?": [
        "Power issues aren’t handled at the moment—we’re focused on civic infrastructure.",
        "For electricity problems, please contact your local power utility directly.",
        "While not available now, power outage reporting may come in future updates.",
        "We don’t currently support this complaint type, but it’s on our future plans."
    ],
    "How do I create an account?": [
        "No account is required. You can simply file a complaint using your mobile number via WhatsApp or SMS.",
        "We’ve kept it easy—no login or registration needed. Just use your phone number to raise complaints.",
        "Your mobile number is enough to file, track, and get updates on your complaint.",
        "No need to sign up or remember passwords—just use your number, and you're good to go."
    ],
    "I forgot my password, how do I reset it?": [
        "You don't need a password to use our service—just your phone number is enough to file and track complaints.",
        "Our platform works entirely without login; complaints are submitted via WhatsApp, SMS, or app using your phone number.",
        "If you're using the app and forgot a passcode (if you set one), reinstalling the app will reset access.",
        "Still need help? Email us with your phone number and issue—we’ll guide you through it."
    ],
    "Can I file a complaint without registering?": [
        "Yes, you can file a complaint directly using your phone number via WhatsApp or SMS—no account needed.",
        "We’ve designed the platform to be fast and hassle-free—just send the complaint details, image, and location.",
        "No registration or login is required—your phone number is used to track and manage your complaint.",
        "Whether you use the app, SMS, or website, filing a complaint is instant—no sign-up process involved."
    ],
    "Is my data safe on this platform?": [
        "Absolutely. We only collect essential information and do not share it with third parties.",
        "Your phone number and details are used strictly for complaint management and resolution.",
        "We follow secure data handling practices and protect your privacy at every step.",
        "We do not display personal info publicly—only complaint details are visible on the dashboard."
    ],
    "Can others see my personal details?": [
        "No, personal details like your name or number are never shown on the public dashboard.",
        "We only display the issue, location, and status—your identity remains private.",
        "Your privacy is a top priority; we don’t share or publish any personal identifiers.",
        "Other users can view the complaint content but not who submitted it."
    ],
    "Why is my phone number needed?": [
        "It helps us track your complaint and send status updates directly to you.",
        "Your number acts as a unique ID, so there's no need for account creation.",
        "It ensures only you can check or follow up on your complaint.",
        "It’s a secure and simple way to link your complaint with you—without login hassles."
    ],
    "Which areas are covered by this website?": [
        "Our platform is available throughout India—you can report from any city, town, or village.",
        "We operate on a pan-India basis, making sure civic issues across all states are addressed.",
        "Whether you're in Delhi, a remote village, or anywhere in between—our service is accessible.",
        "No matter your location in India, you can use our platform to file and track complaints."
    ],
    "Can I report a problem in a different district?": [
        "Yes, feel free to report issues even if they’re in another city or district—it’s allowed.",
        "Many users help report problems outside their home area, and our system handles them equally.",
        "We forward complaints based on their location, not the origin of the user.",
        "Reporting problems from other districts is fully supported and encouraged."
    ],
    "My area is not listed, what can I do?": [
        "If your locality isn’t auto-listed, just type in the name or send your live location.",
        "We allow manual entry of any area across India—just describe your place clearly.",
        "You can still file a complaint—use the app’s GPS or type the address manually.",
        "If the area’s not recognized, send us an email and we’ll update it in our system."
    ],
    "How do I mark the location of the problem?": [
        "On the app, you can pin your GPS location directly for better accuracy.",
        "You can describe the address manually or attach coordinates through WhatsApp.",
        "Simply allow location access in the app, or type in the nearest landmark.",
        "Location can be shared as text, image, or via GPS depending on how you report."
    ],
    "How do I report an emergency like an open manhole or exposed wires?": [
        "For critical issues like open manholes, send a WhatsApp/SMS with the location and description—we prioritize emergencies.",
        "Mention “urgent” or “danger” in your message, and our system flags it for faster action.",
        "Use the app to mark it as high priority, or notify us via message—the concerned authority is alerted immediately.",
        "Emergencies like open drains or exposed wires are handled on priority—just submit the complaint normally, we handle the rest."
    ],
    "Will urgent complaints be resolved faster?": [
        "Yes, we prioritize complaints based on severity and type. Life-threatening or hazardous issues are dealt with immediately.",
        "Complaints like open manholes, sewage overflows, or broken streetlights in busy areas are expedited.",
        "Urgent civic concerns are fast-tracked and assigned to authorities without delay.",
        "Our AI model helps detect critical issues and puts them at the top of the queue for quick response."
    ],
    "What if the issue is putting people’s lives at risk?": [
        "Please include “URGENT” in your message and provide a clear photo—our system flags such issues instantly.",
        "Issues that risk public safety are given highest attention and sent directly to the authorities.",
        "Your safety is our top priority. Report the issue immediately, and we’ll handle it with urgency.",
        "We take such complaints seriously. Mention any risk to human life or injury for prompt intervention."
    ],
    "What happens if someone files a fake complaint?": [
        "We have advanced systems to detect fake or malicious complaints, and repeated offenders are banned.",
        "Submitting fake issues disrupts genuine cases and wastes public resources—strict action is taken.",
        "Complaints flagged as false by authorities are logged and user activity is closely monitored.",
        "Intentional misuse can lead to blacklisting the phone number and denying access to the platform."
    ],
    "Can I report a duplicate or spam complaint?": [
        "Yes, if you notice duplicate or spam complaints, email us with the complaint details or ID.",
        "Our team will review such complaints and take corrective action if necessary.",
        "Spam and repeated reports without new info are flagged automatically, but your reports help.",
        "We encourage the community to help us keep the platform clean and authentic."
    ],
    "How do you verify the authenticity of complaints?": [
        "Our system uses AI to cross-check text, location, images, and frequency patterns for signs of spam.",
        "Complaints with poor-quality info or repetition are auto-flagged for manual review.",
        "Verified details like location accuracy, unique photos, and valid categories improve trust score.",
        "Authorities also confirm the complaint's validity during investigation, adding a second layer of filtering."
    ],
    "Who handles the complaint after I submit it?": [
        "The system forwards your complaint to the appropriate local authority based on the issue type and location.",
        "Depending on the problem, it could be the municipality, water board, or PWD, among others.",
        "Each issue is mapped to the department responsible for that civic service.",
        "Our backend ensures seamless routing of your complaint to the right authority."
    ],
    "How are complaints prioritized?": [
        "Complaints are categorized by urgency, type (e.g., potholes vs. graffiti), and severity.",
        "Emergency issues like open manholes or electrical hazards get immediate attention.",
        "The system also considers complaint density and impact radius while sorting priorities.",
        "Urgent, hazardous, or high-traffic area complaints are resolved first."
    ],
    "Will I get feedback on the resolution?": [
        "Yes, once the complaint is resolved, you’ll get a notification on your registered number.",
        "You can also check your complaint status and resolution update using your number on the website.",
        "Our public dashboard reflects updated resolution times and actions taken.",
        "If you'd like to provide a response to the resolution, you can email your feedback to us."
    ],
    "Can I edit my complaint after submitting?": [
        "Currently, direct editing isn't available to ensure data integrity, but corrections can be emailed.",
        "If the complaint hasn’t been processed, we may manually update the content.",
        "You can also resubmit a corrected version with updated details.",
        "Edits aren't allowed through the user interface to prevent misuse."
    ],
    "I entered wrong details—how do I correct them?": [
        "If there's an error, please email us immediately with the correct info and your phone number.",
        "If possible, mention your original complaint ID so we can link the changes.",
        "You can also re-submit a corrected complaint and notify us to ignore the previous one.",
        "Corrections are allowed early in the process—once assigned, they can’t be changed."
    ],
    "Can I delete my complaint?": [
        "No, complaints cannot be deleted once submitted to maintain transparency and accountability.",
        "This ensures civic data is preserved for review and public record.",
        "Deleting complaints would affect tracking and resolution accountability.",
        "Mistakes can be corrected, but deletion is not allowed by policy."
    ],
    "How do I contact support?": [
        "You can email our support team with your phone number and complaint ID for assistance.",
        "Support is available for issues related to complaint updates, spam, and technical problems.",
        "We aim to respond within 24–48 hours for all support queries.",
        "Use the feedback option in the app or website for faster access."
    ],
    "I have suggestions to improve the site. Where can I share them?": [
        "Please email your suggestions to our official support email—we review all user ideas.",
        "If you have a feature request or improvement idea, describe it clearly and how it helps.",
        "Your feedback shapes the platform, and many existing features came from user input.",
        "We're open to ideas like new categories, UI changes, and accessibility improvements."
    ],
    "Where can I give feedback on complaint resolution?": [
        "You can email us your experience and feedback after the issue is marked resolved.",
        "If you’re not satisfied, include the complaint ID and reason—we'll review the closure.",
        "We record user satisfaction to improve future handling.",
        "Your feedback helps improve authority accountability and system performance."
    ],
    "Can I escalate my complaint if it’s not resolved?": [
        "Yes, if your issue hasn’t been resolved in a reasonable time, you can email us with your complaint ID to escalate.",
        "Escalated complaints are prioritized for follow-up and flagged to the respective department.",
        "For urgent or ignored issues, resubmitting with added urgency helps trigger review.",
        "You can also use your number to re-check status and track pending issues."
    ],
    "Is there a text-to-speech or accessibility feature?": [
        "We're working on accessibility tools, including voice support and screen reader compatibility.",
        "Currently, mobile accessibility options like magnification and text-to-speech can help.",
        "We aim to add full accessibility support in future app and web versions.",
        "Your suggestions on accessibility are welcome—email us any ideas to improve it."
    ],
    "Is the website available in regional languages?": [
        "Regional language support is coming soon—we plan to support Hindi, Bengali, Tamil, and more.",
        "Our WhatsApp bot already understands basic complaints in multiple Indian languages.",
        "Language accessibility is a key part of our upcoming upgrades.",
        "Until then, feel free to report issues in your local language, and our system will try to understand it."
    ],
    "Why should I report civic problems?": [
        "Reporting helps improve your area and alerts authorities to take action.",
        "It empowers citizens to actively participate in local governance.",
        "Collective reporting brings transparency and forces quicker resolutions.",
        "Your voice leads to real change—be a part of civic improvement."
    ],
    "What happens after a problem is reported?": [
        "Your complaint is routed to the right authority and added to the public dashboard.",
        "It is prioritized, verified, and scheduled for resolution based on severity.",
        "You'll receive updates and a closure notice once it's fixed.",
        "Public issues are tracked until resolved—nothing is lost or ignored."
    ],
    "How can I help spread awareness about civic reporting?": [
        "Share our website/app with your friends and community on social media or WhatsApp.",
        "Encourage local groups, RWAs, and NGOs to use the platform for neighborhood issues.",
        "You can organize awareness drives in your area to promote civic participation.",
        "Word of mouth is powerful—every report counts toward a cleaner, safer India."
    ],
    "Can I use this complaint record in court?": [
        "Yes, all complaints you file via our platform are time-stamped and stored—they can serve as supporting evidence in legal or civic proceedings.",
        "Screenshots of your complaint, updates, and public dashboard listings can help prove that the issue was reported.",
        "You can email us to request a formal copy of your complaint details if needed for court purposes.",
        "Courts consider complaint records and communications with authorities as valid documents in cases of civic negligence."
    ],
    "What are my legal rights if the problem persists?": [
        "As a citizen, you have the legal right to access clean, safe public infrastructure—if authorities fail to act, you can escalate through the state’s public grievance portal or Lokpal system.",
        "You may file an RTI (Right to Information) request to know why your issue wasn’t resolved within a reasonable time.",
        "For continued negligence in critical issues (like sewage, water supply, etc.), legal action can be taken through consumer forums or civil court.",
        "Our platform provides documented proof that your complaint was reported, which can support legal action if needed."
    ],
}

def get_option_mode_response(last_option):
    if not last_option or last_option.strip() == "":
        intro = RESPONSES["civil_problem_intro"][0]
        return {"reply": intro["reply"], "options": intro["options"]}
    # If the last_option is a category, show its questions
    if last_option in OPTION_MAP:
        category = last_option
        response = RESPONSES.get(category, [{"reply": "Please select a question:", "options": []}])[0]
        return {"reply": response["reply"], "options": response["options"]}
    # If the last_option is a question, check for a custom answer first
    # Fix: Normalize quotes for matching (handles curly/smart quotes vs straight quotes)
    def normalize_quotes(s):
        return s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace("`", "'").strip().lower()
    norm_last_option = normalize_quotes(last_option)
    for key in CUSTOM_ANSWERS:
        if normalize_quotes(key) == norm_last_option:
            answer = random.choice(CUSTOM_ANSWERS[key])
            followup = "\n\nDo you need to ask something else?"
            return {"reply": answer + followup, "options": []}
    return {"reply": "Sorry, I don't have an answer for that question yet.\n\nDo you need to ask something else?", "options": []}

def get_bot_response(message):
    msg = message.lower()
    # Specific civil issues first
    if "garbage" in msg or "waste" in msg or "trash" in msg:
        return {"reply": random.choice(RESPONSES["garbage"]), "options": []}
    if "pothole" in msg or "road" in msg:
        return {"reply": random.choice(RESPONSES["potholes"]), "options": []}
    if "streetlight" in msg or "light" in msg:
        return {"reply": random.choice(RESPONSES["streetlights"]), "options": []}
    if "water" in msg:
        return {"reply": random.choice(RESPONSES["water_supply"]), "options": []}
    if "sewage" in msg or "drain" in msg:
        return {"reply": random.choice(RESPONSES["sewage"]), "options": []}
    # General civil problem check after specific ones
    if "civil problem" in msg or "civil issue" in msg or "civil law" in msg:
        response = random.choice(RESPONSES["civil_problem_intro"])
        return response
    if "property dispute" in msg or "land dispute" in msg:
        return {"reply": random.choice(RESPONSES["property_dispute"]), "options": []}
    if "family issue" in msg or "divorce" in msg or "inheritance" in msg or "child custody" in msg:
        return {"reply": random.choice(RESPONSES["family_issue"]), "options": []}
    if "contract" in msg or "agreement" in msg or "breach" in msg:
        return {"reply": random.choice(RESPONSES["contract_issue"]), "options": []}
    if any(greet in msg for greet in ["hello", "hi", "hey"]):
        return {"reply": random.choice(RESPONSES["greeting"]), "options": []}
    if "what is a chatbot" in msg or "define chatbot" in msg:
        return {"reply": random.choice(RESPONSES["chatbot_definition"]), "options": []}
    if "how does a chatbot work" in msg or "chatbot work" in msg:
        return {"reply": random.choice(RESPONSES["chatbot_work"]), "options": []}
    # Remove Gemini fallback, use only default message
    return {"reply": "Sorry, I don't have an answer for that question yet.", "options": []}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    option_mode = data.get('option_mode', False)
    last_option = data.get('last_option', None)
    if option_mode:
        # Always use user_message as last_option, unless it's empty
        response = get_option_mode_response(user_message)
        return jsonify(response)
    else:
        bot_reply = get_bot_response(user_message)
        return jsonify(bot_reply)

if __name__ == '__main__':
    app.run(port=5000)

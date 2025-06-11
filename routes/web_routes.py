from flask import Blueprint, render_template, request, jsonify
from services.db_service import get_user_by_phone, get_user_complaints, get_all_complaints, get_complaint_stats, get_user_by_id
from services.whatsapp_service import send_reply
import logging

logger = logging.getLogger(__name__)

web_bp = Blueprint('web', __name__)

@web_bp.route('/')
def index():
    """Home page"""
    return render_template('citizenpage.html')

@web_bp.route('/citizen')
def citizen_page():
    """Citizen complaint tracking page"""
    return render_template('citizenpage.html')

@web_bp.route('/admin')
def admin_page():
    """Admin dashboard page"""
    return render_template('adminpage.html')

@web_bp.route('/admin/push')
def push_update_page():
    """Admin push update page"""
    return render_template('pushupdate.html')

@web_bp.route('/dashboard')
def public_dashboard():
    """Public transparency dashboard"""
    return render_template('dash.html')

# API Routes for Citizen Page
@web_bp.route('/api/citizen/complaints', methods=['POST'])
def get_citizen_complaints():
    """API endpoint to get complaints for a specific phone number"""
    try:
        logger.info(f"Received request to /api/citizen/complaints")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        phone_number = data.get('phone_number') if data else None
        
        if not phone_number:
            logger.warning("No phone number provided in request")
            return jsonify({'error': 'Phone number is required'}), 400
        
        # Clean phone number format
        phone_number = phone_number.replace('+', '').replace('-', '').replace(' ', '')
        logger.info(f"Cleaned phone number: {phone_number}")
        
        # Get user by phone number
        user = get_user_by_phone(phone_number)
        if not user:
            logger.warning(f"User not found for phone number: {phone_number}")
            return jsonify({'error': 'Phone number not found in our system'}), 404
            return jsonify({'error': 'Phone number not found in our system'}), 404
        
        # Get user's complaints
        complaints = get_user_complaints(user['id'])
        
        # Calculate stats
        total_complaints = len(complaints)
        resolved_complaints = len([c for c in complaints if c.get('status') == 'Resolved'])
        pending_complaints = total_complaints - resolved_complaints
        
        # Calculate average resolution time (mock calculation)
        avg_resolution_days = 7 if resolved_complaints > 0 else 0
        
        stats = {
            'total': total_complaints,
            'resolved': resolved_complaints,
            'pending': pending_complaints,
            'avg_resolution_days': avg_resolution_days
        }
        
        return jsonify({
            'success': True,
            'complaints': complaints,
            'stats': stats
        })
        
    except Exception as e:
        logger.error(f"Error fetching citizen complaints: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# API Routes for Admin Page
@web_bp.route('/api/admin/complaints', methods=['GET'])
def get_admin_complaints():
    """API endpoint to get all complaints for admin"""
    try:
        complaints = get_all_complaints()
        
        # Format complaints for admin view
        formatted_complaints = []
        for complaint in complaints:
            # Get user phone for this complaint
            try:
                user = get_user_by_id(complaint.get('user_id'))
                phone = user.get('phone', 'Unknown') if user else 'Unknown'
            except:
                phone = 'Unknown'
            
            priority_text = 'High' if complaint.get('priority_score', 0) > 0.7 else \
                           'Medium' if complaint.get('priority_score', 0) > 0.4 else 'Low'
            
            formatted_complaints.append({
                'id': complaint.get('id', ''),
                'phone': phone,
                'title': complaint.get('title', complaint.get('description', '')[:50] + '...'),
                'category': complaint.get('category', 'General'),
                'status': complaint.get('status', 'Pending'),
                'priority': priority_text,
                'date': complaint.get('created_at', '')[:10] if complaint.get('created_at') else '',
                'description': complaint.get('description', ''),
                'location': complaint.get('location', {}),
                'priority_score': complaint.get('priority_score', 0)
            })
        
        return jsonify(formatted_complaints)
        
    except Exception as e:
        logger.error(f"Error fetching admin complaints: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@web_bp.route('/api/admin/push_update', methods=['POST'])
def push_update_to_user():
    """API endpoint to push updates to users via WhatsApp"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        complaint_id = data.get('complaint_id')
        message = data.get('message')
        
        if not all([phone, complaint_id, message]):
            return jsonify({'error': 'Phone, complaint ID, and message are required'}), 400
        
        # Clean phone number
        phone = phone.replace('+', '').replace('-', '').replace(' ', '')
        if not phone.startswith('91'):
            phone = '91' + phone
        
        # Verify complaint exists
        from services.db_service import get_complaint_by_id
        complaint = get_complaint_by_id(complaint_id)
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
        
        # Format update message
        update_text = f"🔔 Update on your complaint (ID: {complaint_id[:8]})\n\n{message}\n\n📞 Contact support if you need assistance."
        
        # Send WhatsApp message
        try:
            send_reply(phone, update_text)
            logger.info(f"✅ Update sent to {phone} for complaint {complaint_id}")
            return jsonify({'success': True, 'message': 'Update sent successfully'})
        except Exception as e:
            logger.error(f"Failed to send WhatsApp message: {e}")
            return jsonify({'error': 'Failed to send WhatsApp message'}), 500
            
    except Exception as e:
        logger.error(f"Error pushing update: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# API Routes for Public Dashboard
@web_bp.route('/api/public/stats', methods=['GET'])
def get_public_stats():
    """API endpoint to get public statistics"""
    try:
        stats = get_complaint_stats()
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error fetching public stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@web_bp.route('/api/public/complaints', methods=['GET'])
def get_public_complaints():
    """API endpoint to get public complaints (anonymized)"""
    try:
        complaints = get_all_complaints()
        
        # Anonymize and format for public view
        public_complaints = []
        for complaint in complaints[-20:]:  # Show last 20 complaints
            public_complaints.append({
                'id': complaint.get('id', ''),
                'category': complaint.get('category', 'General'),
                'status': complaint.get('status', 'Pending'),
                'date': complaint.get('created_at', '')[:10] if complaint.get('created_at') else '',
                'title': complaint.get('title', complaint.get('description', '')[:100] + '...')
            })
        
        return jsonify(public_complaints)
        
    except Exception as e:
        logger.error(f"Error fetching public complaints: {e}")
        return jsonify({'error': 'Internal server error'}), 500

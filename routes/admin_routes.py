from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/api/admin/update-complaint", methods=["POST"])
def update_complaint():
    try:
        complaint_id = request.form.get("id")
        status = request.form.get("status")
        comment = request.form.get("comment")
        evidence = request.files.get("evidence")

        if evidence:
            upload_dir = "uploads/"
            os.makedirs(upload_dir, exist_ok=True)
            filename = secure_filename(evidence.filename) # type: ignore
            evidence.save(os.path.join(upload_dir, filename))

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

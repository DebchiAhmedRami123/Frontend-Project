import os
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from App.core.ai.detector import get_detector
from App.utils import get_current_user
from werkzeug.utils import secure_filename

bp_recognition = Blueprint('recognition', __name__, url_prefix='/recognition')

@bp_recognition.route('/health', methods=['GET'])
def health_check():
    """Simple endpoint to verify server is reachable."""
    return jsonify({"status": "ok", "message": "Server is reachable"}), 200

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'uploads', 'scans')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@bp_recognition.route('/classify', methods=['POST'])
@jwt_required()
def classify_food():
    """
    Receives an image, runs detection, and returns nutritional breakdown.
    """
    print("AI Trace: Classification request received.")
    if 'image' not in request.files:
        print("AI Trace: Error - No image file in request.")
        return jsonify({'message': 'No image file provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        print("AI Trace: Error - Empty filename.")
        return jsonify({'message': 'Empty filename'}), 400

    # Save file temporarily
    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    print(f"AI Trace: File saved to {filepath}. File size: {os.path.getsize(filepath)} bytes.")

    try:
        # Run detection
        print("AI Trace: Triggering detection service...")
        detector = get_detector()
        detections = detector.detect(filepath)
        print(f"AI Trace: Detection complete. Found {len(detections)} items.")
        
        # Calculate totals
        total_calories = sum(d['calories'] for d in detections)
        total_protein = sum(d['protein'] for d in detections)
        total_carbs = sum(d['carbs'] for d in detections)
        total_fats = sum(d['fats'] for d in detections)
        
        # In a real scenario, we might want to keep the image for the dashboard
        # For now, we return the data and let the frontend handle the next step
        
        print(f"AI Success: Detected {len(detections)} items. Totals: {total_calories} kcal, {total_protein}g P, {total_carbs}g C, {total_fats}g F")
        
        return jsonify({
            'success': True,
            'detections': detections,
            'summary': {
                'total_calories': total_calories,
                'total_protein': total_protein,
                'total_carbs': total_carbs,
                'total_fats': total_fats
            },
            'image_path': filepath
        }), 200
        
    except Exception as e:
        print(f"AI API Error: {str(e)}")
        return jsonify({'message': 'Internal server error during classification', 'error': str(e)}), 500
    finally:
        # We keep the file for now to show on dashboard if logged
        pass

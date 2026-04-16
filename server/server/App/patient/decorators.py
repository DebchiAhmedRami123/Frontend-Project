from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

def patient_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        current_user = get_jwt_identity()
 
        if current_user.get('user_type') != 'patient':
            return jsonify({'error': 'Patient access required'}), 403
 
        return f(*args, **kwargs)
    return decorated
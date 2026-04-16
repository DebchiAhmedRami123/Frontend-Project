from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify


def nutritionist_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        current_user = get_jwt_identity()

        if current_user['user_type'] != 'nutritionist':
            return jsonify({'error': 'Nutritionist access required'}), 403

        return f(*args, **kwargs)
    return decorated
from App.models import User, Admin, db
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from App.utils import get_current_user
import uuid

def admin_required(f):
    """Checks if logged-in user is an admin at all"""
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        current_user = get_current_user(uuid.UUID(current_user['id']))
        if current_user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


def permission_required(permission_name):
    """Checks if admin has a SPECIFIC permission"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            current_user = get_current_user(uuid.UUID(current_user['id']))

            user = db.session.query(User).get(current_user['id'])
            admin_permissions = [p.name for p in user.admin_profile.permissions]

            if permission_name not in admin_permissions:
                return jsonify({'error': f'Missing permission: {permission_name}'}), 403

            return f(*args, **kwargs)
        return decorated
    return decorator


def super_admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        user = db.session.get(User,uuid.UUID(current_user['id']))

        if not user.is_super_admin:
            return jsonify({'error': 'Super admin access required'}), 403

        return f(*args, **kwargs)
    return decorated
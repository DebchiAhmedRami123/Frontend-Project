import json
import secrets
from datetime import timedelta

from flask import request, jsonify
from marshmallow import ValidationError
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    get_jwt
)

from App.models import User, Client, Nutritionist, db
from App.auth.extensions import bp_auth
from App.auth.userSchemas import SignSchema, LoginSchema, ResetPasswordSchema
from App.extensions import bc, redis_client
from App.utils import get_current_user, send_reset_email


# ── Sign Up ─────────────────────────────────────────────────────────────────────

@bp_auth.route('/sign-up', methods=['POST'])
def signUP():
    data = request.get_json()
    schema = SignSchema()
    try:
        validated = schema.load(data)
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422

    validated['password'] = bc.generate_password_hash(validated['password']).decode('utf-8')

    role = data.get('role', 'client')
    
    if role == 'nutritionist':
        new_user = Nutritionist(
            first_name=validated['first_name'],
            last_name=validated['last_name'],
            email=validated['email'],
            password=validated['password'],
        )
    else:
        new_user = Client(
            first_name=validated['first_name'],
            last_name=validated['last_name'],
            email=validated['email'],
            password=validated['password'],
        )
        
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(
        identity=str(new_user.id),
        additional_claims={'user_type': new_user.user_type}
    )
    refresh_token = create_refresh_token(identity=str(new_user.id))

    return jsonify({
        'message': 'Account created successfully!',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'role': new_user.user_type,
        'user': new_user.to_dict()
    }), 201


# ── Login Step 1 — email check ──────────────────────────────────────────────────

@bp_auth.route('/login', methods=['POST'])
def loginEmail():
    schema = LoginSchema(only=('email',))
    try:
        loaded_data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422

    login_user = db.session.query(User).filter_by(email=loaded_data['email']).first()
    if not login_user:
        return jsonify({'message': 'The Account does not exist!'}), 404

    temp_token = secrets.token_urlsafe(32)
    redis_client.setex(
        f"login_session:{temp_token}",
        300,  # expires in 5 minutes
        loaded_data['email']
    )

    return jsonify({
        'message': 'Complete your login process',
        'temp_token': temp_token
    }), 200


# ── Login Step 2 — password verification ────────────────────────────────────────

@bp_auth.route('/login-completion', methods=['POST'])
def loginPassword():
    ip = request.remote_addr
    attempts_key = f"login_attempts:{ip}"
    attempts = redis_client.get(attempts_key)

    if attempts and int(attempts) >= 5:
        ttl = redis_client.ttl(attempts_key)
        return jsonify({
            'message': f'Too many attempts. Try again in {ttl} seconds'
        }), 429

    data = request.get_json()
    password = data.get('password')
    temp_token = data.get('temp_token')

    if not password or not temp_token:
        return jsonify({'message': 'Password and session token are required'}), 400

    # Look up email from the session token
    email = redis_client.get(f"login_session:{temp_token}")
    if not email:
        return jsonify({'message': 'Session expired, please enter your email again'}), 401

    login_user = db.session.query(User).filter_by(email=email).first()
    if not login_user or not bc.check_password_hash(login_user.password, password):
        redis_client.incr(attempts_key)
        redis_client.expire(attempts_key, 300)
        return jsonify({'message': 'Invalid credentials'}), 401

    # Success — clean up session
    redis_client.delete(f"login_session:{temp_token}")
    redis_client.delete(attempts_key)

    access_token = create_access_token(
        identity=str(login_user.id),
        additional_claims={'user_type': login_user.user_type}
    )
    refresh_token = create_refresh_token(identity=str(login_user.id))

    return jsonify({
        'message': 'Login Successfully!',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'role': login_user.user_type,
        'user': login_user.to_dict()
    }), 200


# ── Logout ──────────────────────────────────────────────────────────────────────

@bp_auth.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    redis_client.setex(
        jti,
        timedelta(hours=1),
        "revoked",
    )
    return jsonify({'message': 'Logged out successfully!'}), 200


# ── Delete Account ──────────────────────────────────────────────────────────────

@bp_auth.route('/delete', methods=['DELETE'])
@jwt_required()
def deleteAccount():
    cur_user = get_current_user()
    db.session.delete(cur_user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully!'}), 200


# ── Refresh Token ───────────────────────────────────────────────────────────────

@bp_auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refreshToken():
    identity = get_jwt_identity()
    user = db.session.get(User, identity)
    access_token = create_access_token(
        identity=identity,
        additional_claims={'user_type': user.user_type if user else 'client'}
    )
    return jsonify({'access_token': access_token}), 200


# ── Profile ─────────────────────────────────────────────────────────────────────

@bp_auth.route('/profile', methods=['GET'])
@jwt_required()
def getProfile():
    user_id = get_jwt_identity()
    cache_key = f"profile:{user_id}"
    cache_value = redis_client.get(cache_key)

    if cache_value:
        return jsonify(json.loads(cache_value)), 200

    cur_user = get_current_user()
    if not cur_user:
        return jsonify({'message': 'User not found'}), 404

    user_data = SignSchema().dump(cur_user)
    redis_client.setex(cache_key, 300, json.dumps(user_data))
    return jsonify(user_data), 200


# ── Forgot Password ────────────────────────────────────────────────────────────

@bp_auth.route('/forgot-password', methods=['POST'])
def forgotPassword():
    schema = LoginSchema(only=('email',))
    try:
        loaded_data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422

    target_user = db.session.query(User).filter_by(email=loaded_data['email']).first()
    if not target_user:
        # Don't reveal whether email exists — always return 200
        return jsonify({'message': 'If that email exists, a reset link has been sent.'}), 200

    send_reset_email(target_user)
    return jsonify({'message': 'If that email exists, a reset link has been sent.'}), 200


# ── Reset Password ─────────────────────────────────────────────────────────────

@bp_auth.route('/reset-password', methods=['POST'])
def resetPassword():
    schema = ResetPasswordSchema()
    try:
        loaded_data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422

    target_user = User.check_reset_token(loaded_data['token'])
    if isinstance(target_user, tuple):
        return target_user
    if not target_user:
        return jsonify({'message': 'Invalid or expired reset token'}), 400

    target_user.password = bc.generate_password_hash(loaded_data['password']).decode('utf-8')
    db.session.commit()
    return jsonify({'message': 'Password reset successfully!'}), 200
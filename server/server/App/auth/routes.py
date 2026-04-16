import json
import secrets
from datetime import datetime, timedelta
from pprint import pprint
import uuid
from flask import request, jsonify
from marshmallow import ValidationError
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    get_jwt
)

from App.models import User, Patient, Nutritionist, StatusEnum, db
from flask import Blueprint
from App.auth.userSchemas import SignSchema, LoginSchema, ResetPasswordSchema, PatientRoleSchema, NutritionistRoleSchema
from App.extensions import bc, redis_client
from App.utils import get_current_user, send_reset_email, register_as_patient, register_as_nutritionist

bp_auth = Blueprint('auth', __name__, url_prefix='/auth')

# ── Sign Up ─────────────────────────────────────────────────────────────────────

@bp_auth.route('/sign-up',methods=['POST'])
def signUP():
    schema = SignSchema()
    try:
        loaded_data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({'message': e.messages, 'code': 422})

    pprint(loaded_data)
    loaded_data['password'] = bc.generate_password_hash(loaded_data['password']).decode('utf-8')
    new_user = User(loaded_data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message':'Your Account has been created successfully!','code':201}) #created
    #redirect it to login
    
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
    LoginSchema = LoginSchema()
    ip = request.remote_addr
    attempts_key = f"login_attempts:{ip}"
    attempts = redis_client.get(attempts_key)

    if attempts and int(attempts) >= 5:
        return jsonify({
            'message': f'Too many attempts. Try again in {5} minutes'
        }), 429

    login_user = LoginSchema.load(request.get_json())
    temp_token = request.get_json('temp_token')

    if not login_user or not temp_token:
        return jsonify({'message': 'Password and session token are required'}), 400

    password = login_user.get('password')
    entered_email = login_user.get('email')

    # Look up email from the session token
    cached_email = redis_client.get(f"login_session:{temp_token}")

    if not cached_email:
        return jsonify({'message': 'Session expired, please enter your email again'}), 401
    
    if entered_email != cached_email:
        return jsonify({'message': 'Email does not match the session'}), 400

    login_user = db.session.query(User).filter_by(email=cached_email).first()
    if not login_user or not bc.check_password_hash(login_user.password, password):
        redis_client.incr(attempts_key) # increments the integer value by 1 and returns the new value and create it if it doesn't exist
        # redis_client.expire(attempts_key, 300) # set the expire time 5 minutes to this key in every iteration
        return jsonify({'message': 'Invalid credentials'}), 401

    # Success — clean up session
    redis_client.delete(f"login_session:{temp_token}")
    redis_client.delete(attempts_key)
    if login_user.status in [StatusEnum.BANNED, StatusEnum.INACTIVE]:
        return jsonify({'error': 'Account is not active'}), 403

    access_token = create_access_token(
        identity=str(login_user.id),
        additional_claims={'user_type': login_user.user_type}
        # expires_delta=timedelta(hours=1) # optional _ will craze the global expiration time which we set in the app configuration
        # we use the key `exp` for get the expiration time of the token in the frontend
    )
    refresh_token = create_refresh_token(identity=str(login_user.id))

    return jsonify({
        'message': 'Login Successfully!',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'role': login_user.user_type,
        'ID': str,
    }), 200


# ── Forgot Password ────────────────────────────────────────────────────────────

@bp_auth.route('/forgot-password', methods=['POST'])
def forgotPassword():
    schema = LoginSchema(only=('email',))
    loaded_data = None
    try:
        loaded_data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422


    target_user = db.session.query(User).filter_by(email=loaded_data['email']).first()
    if not target_user:
        return jsonify({'message': 'Your email is incorrect'}), 403


    send_reset_email(target_user)
    return jsonify({'message': 'If that email exists, a reset link has been sent.'}), 200


# ── Logout ──────────────────────────────────────────────────────────────────────

@bp_auth.route('/user/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    expire_time = get_jwt()['exp']
    remaining_time = expire_time - datetime.utcnow().timestamp()
    redis_client.setex(
        jti,
        remaining_time,
        "revoked",
    )
    return jsonify({'message': 'Logged out successfully!'}), 200 
    # redirect to home page and disable its access to other protected pages in front end


# ── Delete Account ──────────────────────────────────────────────────────────────

@bp_auth.route('/user/delete', methods=['DELETE'])
@jwt_required()
def deleteAccount():
    cur_user = get_current_user()
    db.session.delete(cur_user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully!'}), 200


# ── Refresh Token ───────────────────────────────────────────────────────────────

@bp_auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True) # when the refresh token is expired Flask-JWT-Extended automatically 
# returns a 401 Unauthorized error with a message like "Token has expired" so the refresh function never called
# and must be redirect the user to the login page in the frontend
def refreshToken():
    identity = get_jwt_identity()
    user = db.session.get(User, identity)
    access_token = create_access_token(
        identity=identity,
        additional_claims={'user_type': user.user_type if user else 'client'}
    )
    return jsonify({'access_token': access_token}), 200
# What if you want to issue a new refresh token every time (refresh token rotation)?
# That's a different design. In rotation, when the client sends a valid refresh token, you:
    # Invalidate the old refresh token (e.g., blacklist it or delete it from your database).
    # Create and return both a new access token and a new refresh token.
    # The client stores the new refresh token and discards the old one.
# This improves security because each refresh token is single-use. If an attacker steals a refresh 
# token and tries to use it after the legitimate user, it will fail (since it was already rotated).
# However, this requires storing token state (e.g., in a database or Redis) to track valid refresh tokens.
# Your current code does not do rotation — it only returns a new access token, leaving the original refresh 
# token valid until it expires.


# ── Profile ─────────────────────────────────────────────────────────────────────
# json.load() reads json object from a file -> convert to python object which can be [dict, object, list, etc]
# json.loads() reads from a json string -> convert to python object which can be [dict, object, list, etc]

#json.dump() from python object -> return json string (ex: write it to a file)
#json.dumps() from python object -> return json string (ex: store in redis)
@bp_auth.route('/user/profile', methods=['GET'])
@jwt_required()
def getProfile(user_id):
    user_id = get_jwt_identity()
    cache_key = f"profile:{user_id}"
    cache_value = redis_client.get(cache_key)

    if cache_value:
        return jsonify(json.loads(cache_value)), 200 #loads() parse the "string json" to a "python object"

    cur_user = get_current_user()
    if not cur_user:
        return jsonify({'message': 'User not found'}), 404

    user_data = SignSchema().dump(cur_user) # from model instance to dict
    redis_client.setex(cache_key, 300, json.dumps(user_data)) # from dict to json string
    return jsonify(user_data), 200

# Note:the dump() and load() functions is differ from the functions of "json flask object" because the first
# convert from model into dict instance and the second does the convertion in the reverse direction

# ── Reset Password ─────────────────────────────────────────────────────────────

@bp_auth.route('/reset-password', methods=['POST']) # this resetPassword() function work only with the forgetPassword() function 
def resetPassword():
    schema = ResetPasswordSchema()
    try:
        loaded_data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422

    target_user = User.check_reset_token(loaded_data['token']) 
    # the token which we generate it on backend for this user is resend from the client to server for verification
    if isinstance(target_user, tuple):
        return target_user # exception
    if not target_user:
        return jsonify({'message': 'Invalid or expired reset token'}), 400

    target_user.password = bc.generate_password_hash(loaded_data['password']).decode('utf-8')
    db.session.commit()
    return jsonify({'message': 'Password reset successfully!'}), 200


@bp_auth.route('/user/<user_id>/role', methods=['POST'])
def PatientRole(user_id):
    schema = PatientRoleSchema()
    loaded_data = None
    try:
        loaded_data = schema.load(request.get_json())
        user_uuid = uuid.UUID(user_id)  # Convert string to UUID
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422
    except ValueError:
        return jsonify({'message':'Ivalid UUID format'}), 400
    
    patient = register_as_patient(user_uuid, loaded_data)
    if not patient:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({
        'message': 'User registered as patient successfully!',
    }),200


@bp_auth.route('/user/<user_id>/role', methods=['POST'])
def NutritionistRole(user_id):
    schema = NutritionistRoleSchema()
    loaded_data = None
    try:
        loaded_data = schema.load(request.get_json())
        user_uuid = uuid.UUID(user_id)  # Convert string to UUID
    except ValidationError as e:
        return jsonify({'message': e.messages}), 422
    except ValueError:
        return jsonify({'message':'Ivalid UUID format'}), 400
    
    target_nutritioist = db.session.get(User,user_uuid)
    if not target_nutritioist:
        return jsonify({'message':'user not found'}), 400
    
    target_nutritioist.status = StatusEnum.PENDING
    db.session.commit()
    redis_client.set(f"nutritionist_request:{user_id}",json.dumps(loaded_data))
    #send email to the admin to notify him about this request and with link to redirect it to its account in the exact page 
    return jsonify({'message':'The users status is pending and its request is being processed; please wait for a response '
    '(rejected or approved)'}), 200
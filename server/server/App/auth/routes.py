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

from App.models import User, Patient, Nutritionist, ClientProfile, NutritionistProfile, db
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
            phone=validated.get('phone')
        )
    elif role == 'pending_nutritionist':
        new_user = User(
            first_name=validated['first_name'],
            last_name=validated['last_name'],
            email=validated['email'],
            password=validated['password'],
            phone=validated.get('phone'),
            user_type='pending_nutritionist'
        )
    else:
        new_user = Patient(
            first_name=validated['first_name'],
            last_name=validated['last_name'],
            email=validated['email'],
            password=validated['password'],
            phone=validated.get('phone')
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


# ── Specialist Transitions ─────────────────────────────────────────────────────

@bp_auth.route('/apply-as-nutritionist', methods=['POST'])
@jwt_required()
def applyAsNutritionist():
    cur_user = get_current_user()
    
    # Update user type to pending
    cur_user.user_type = 'pending_nutritionist'
    db.session.commit()
    
    # Generate new tokens with updated role
    access_token = create_access_token(
        identity=str(cur_user.id),
        additional_claims={'user_type': cur_user.user_type}
    )
    refresh_token = create_refresh_token(identity=str(cur_user.id))
    
    return jsonify({
        'message': 'Account transitioned to specialist application.',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'role': cur_user.user_type,
        'user': cur_user.to_dict()
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


# ── Change Password ─────────────────────────────────────────────────────────────

@bp_auth.route('/change-password', methods=['PUT'])
@jwt_required()
def changePassword():
    data = request.get_json()
    cur_user = get_current_user()
    
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not old_password or not new_password:
        return jsonify({'message': 'Old and new passwords are required'}), 400
        
    if not bc.check_password_hash(cur_user.password, old_password):
        return jsonify({'message': 'Invalid current password'}), 403
        
    cur_user.password = bc.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()
    
    return jsonify({'message': 'Password updated successfully!'}), 200


# ── Export Data ─────────────────────────────────────────────────────────────────

@bp_auth.route('/export-data', methods=['GET'])
@jwt_required()
def exportData():
    cur_user = get_current_user()
    
    # Bundle user info
    data = {
        'user': cur_user.to_dict(),
        'history': [m.to_dict() for m in cur_user.meals] if cur_user.user_type == 'client' else []
    }
    
    return jsonify(data), 200


# ── Nutritionist Application ──────────────────────────────────────────────────

@bp_auth.route('/nutritionist-profile', methods=['POST'])
@jwt_required()
def submitNutritionistProfile():
    data = request.get_json()
    cur_user = get_current_user()
    
    allowed_types = {'pending_nutritionist', 'nutritionist'}
    if cur_user.user_type not in allowed_types:
        return jsonify({'message': 'User is not an applicant or already approved'}), 400
        
    # Determine approval path: license_number → auto-approve (Option B)
    has_license = bool(data.get('license_number', '').strip())
    new_status = 'active' if has_license else 'pending'
    
    # Check if profile already exists
    from sqlalchemy import select
    existing_profile = db.session.execute(
        select(NutritionistProfile).where(NutritionistProfile.user_id == cur_user.id)
    ).scalar_one_or_none()
    if existing_profile:
        existing_profile.title = data.get('title', existing_profile.title)
        existing_profile.specialization = data.get('specialization', existing_profile.specialization)
        existing_profile.years_of_experience = data.get('years_of_experience', existing_profile.years_of_experience)
        existing_profile.bio = data.get('bio', existing_profile.bio)
        existing_profile.status = new_status
    else:
        profile = NutritionistProfile(
            user_id=cur_user.id,
            title=data.get('title'),
            specialization=data.get('specialization'),
            years_of_experience=data.get('years_of_experience'),
            bio=data.get('bio'),
            status=new_status
        )
        db.session.add(profile)

    if has_license:
        # Auto-promote: transition user to full nutritionist role
        cur_user.user_type = 'nutritionist'
        # Check if already in nutritionist table
        existing_nutri = db.session.execute(
            db.text("SELECT id FROM nutritionists WHERE id = :uid"),
            {"uid": cur_user.id}
        ).first()
        if not existing_nutri:
            db.session.execute(
                db.text("""
                    INSERT INTO nutritionists (id, specialty, bio, years_of_experience, availability)
                    VALUES (:uid, :specialty, :bio, :exp, :avail)
                """),
                {
                    "uid": cur_user.id,
                    "specialty": data.get('specialization'),
                    "bio": data.get('bio'),
                    "exp": data.get('years_of_experience'),
                    "avail": True
                }
            )

    db.session.commit()

    # Issue fresh tokens reflecting the (possibly updated) role
    access_token = create_access_token(
        identity=str(cur_user.id),
        additional_claims={'user_type': cur_user.user_type}
    )
    refresh_token = create_refresh_token(identity=str(cur_user.id))

    return jsonify({
        'message': 'Profile updated successfully!',
        'status': new_status,
        'role': cur_user.user_type,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': cur_user.to_dict()
    }), 200




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

    user_data = cur_user.to_dict()
    
    # Add profile based on role
    if cur_user.user_type == 'client' and cur_user.profile:
        user_data['profile'] = cur_user.profile.to_dict()
    elif (cur_user.user_type == 'nutritionist' or cur_user.user_type == 'pending_nutritionist') and cur_user.nutritionist_profile:
        user_data['profile'] = cur_user.nutritionist_profile.to_dict()
    else:
        user_data['profile'] = None

    redis_client.setex(cache_key, 300, json.dumps(user_data))
    return jsonify(user_data), 200


@bp_auth.route('/profile', methods=['PUT'])
@jwt_required()
def updateProfile():
    data = request.get_json()
    cur_user = get_current_user()
    if not cur_user:
        return jsonify({'message': 'User not found'}), 404

    try:
        # Helper: convert safely, skip if empty/None
        def safe_int(val, fallback=None):
            if val is None or val == '': return fallback
            try: return int(float(val))
            except: return fallback

        def safe_float(val, fallback=None):
            if val is None or val == '': return fallback
            try: return float(val)
            except: return fallback

        # 1. Update User fields
        if 'first_name' in data and data['first_name']:
            cur_user.first_name = data['first_name']
        if 'last_name' in data and data['last_name']:
            cur_user.last_name = data['last_name']

        # 2. Update ClientProfile fields
        if cur_user.user_type == 'client' and cur_user.profile:
            profile = cur_user.profile
            if 'current_weight' in data: profile.current_weight = safe_float(data['current_weight']) or profile.current_weight
            if 'height' in data: profile.height = safe_float(data['height']) or profile.height
            if 'age' in data: profile.age = safe_int(data['age']) or profile.age
            if 'gender' in data and data['gender']: profile.gender = data['gender']
            if 'goal' in data and data['goal']: profile.goal = data['goal']

        # 3. Update NutritionistProfile fields
        elif cur_user.user_type == 'nutritionist' and cur_user.nutritionist_profile:
            profile = cur_user.nutritionist_profile
            if 'title' in data and data['title']: profile.title = data['title']
            if 'specialization' in data and data['specialization']: profile.specialization = data['specialization']
            yoe = safe_int(data.get('years_of_experience'))
            if yoe is not None: profile.years_of_experience = yoe
            if 'bio' in data and data['bio']: profile.bio = data['bio']
            if 'profile_image' in data and data['profile_image']: profile.profile_image = data['profile_image']
            pi = safe_float(data.get('price_initial'))
            if pi is not None: profile.price_initial = pi
            pf = safe_float(data.get('price_followup'))
            if pf is not None: profile.price_followup = pf
            pm = safe_float(data.get('price_monthly'))
            if pm is not None: profile.price_monthly = pm

        db.session.commit()

        # Bust the cache so the next GET returns fresh data
        redis_client.delete(f"profile:{cur_user.id}")

        # Build the full response including profile so the frontend can sync
        user_data = cur_user.to_dict()
        if cur_user.nutritionist_profile:
            user_data['profile'] = cur_user.nutritionist_profile.to_dict()
        elif cur_user.profile:
            user_data['profile'] = cur_user.profile.to_dict()

        return jsonify({
            'message': 'Profile updated successfully!',
            'user': user_data
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# ── Experts Directory ───────────────────────────────────────────────────────────

@bp_auth.route('/nutritionists', methods=['GET'])
def getNutritionists():
    # Only active approved professionals
    pros = db.session.query(User).filter_by(user_type='nutritionist').all()
    result = []
    
    for pro in pros:
        pro_data = pro.to_dict()
        if pro.nutritionist_profile:
            # Add profile data
            pro_data['profile'] = pro.nutritionist_profile.to_dict()
            
            # Marketplace meta removed as plans are discontinued
            pro_data['plan_count'] = 0
            pro_data['starting_price'] = pro.nutritionist_profile.price_initial

        result.append(pro_data)
    
    return jsonify(result), 200


@bp_auth.route('/nutritionists/<uuid:nutri_id>', methods=['GET'])
def getNutritionistById(nutri_id):
    """Single nutritionist detail for the profile page."""
    user = db.session.get(User, nutri_id)
    if not user or (user.user_type != 'nutritionist' and user.user_type != 'pending_nutritionist'):
        return jsonify({'message': 'Nutritionist not found'}), 404

    pro_data = user.to_dict()
    if user.nutritionist_profile:
        pro_data['profile'] = user.nutritionist_profile.to_dict()
        pro_data['plans'] = [] # Plans discontinued

    return jsonify(pro_data), 200


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


@bp_auth.route('/create-profile', methods=['POST'])
@jwt_required()
def createProfile():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Validate user exists and is a client
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.user_type != 'patient':
        return jsonify({'error': 'Only clients can have health profiles'}), 403

    # Check if profile already exists
    if user.profile:
        return jsonify({'error': 'Profile already exists'}), 400
    
    try:
        # Create profile
        profile = ClientProfile(
            user_id=user.id,
            goal=data.get('goal'),
            activity_level=data.get('activity_level', 'moderate'),
            target_calories=data.get('target_calories')
        )
        
        db.session.add(profile)
        db.session.commit()
        
        # Invalidate cache if exists
        redis_client.delete(f"profile:{user_id}")
        
        return jsonify({
            'message': 'Profile created successfully!',
            'user': user.to_dict(),
            'profile': profile.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
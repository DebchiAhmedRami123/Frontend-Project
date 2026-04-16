from flask import jsonify, request
from marshmallow import ValidationError
from sqlalchemy import select
from flask_jwt_extended import get_jwt_identity
from flask import Blueprint
from App.models import PermissionEnum, User, StatusEnum, StatusLog, Permission, Admin, db
from App.Admin.schemas import admin_schema, user_schema, patient_schema, nutritionist_schema, log_schema
from .decorators import admin_required, permission_required, super_admin_required
from App.Admin.utils import (
    send_apporval_notification,
    send_rejected_notification,
    send_deleted_account_notification,
    send_block_account_notification
)
from App.Admin.utils import log_status_change
from App.auth.userSchemas import AdminSignInSchema
from App.extensions import bc
import uuid

bp_admin = Blueprint('admin', __name__, url_prefix='/admin')

@bp_admin.route('/users', methods=['GET'])
@admin_required
@permission_required('view_users') # can filtred by type and status using query params
def list_users():
    user_type = request.args.get('user_type')   # filter by type pass it as query param
    status    = request.args.get('status') # filter by status pass it as query param
    current_admin_jwt = get_jwt_identity()
    current_admin = db.session.get(Admin,current_admin_jwt['id'])

    query = db.session.query(User)
    if not user_type and not status:
        query = query.filter(User.user_type!='admin',status=StatusEnum.ACTIVE) #default response when no query parameter received
    
    if not user_type:
        if not current_admin.is_super_admin:
            query = query.filter_by(user_type!='admin')
        else:
            query = query.filter_by(user_type='admin')

    query = query.filter_by(user_type=user_type)
    if not status:
        status = StatusEnum.ACTIVE
    try:
        status = StatusEnum(status.upper())
        query = query.filter_by(status=status)
    except KeyError:
        return jsonify({'error':'Invalid status'}),400

    users = query.all()
    return user_schema(many=True).jsonify(users)

@bp_admin.route('/users/<int:user_id>', methods=['GET']) #read
@admin_required
@permission_required('view_users')
def get_user(user_id):
    current_admin_jwt = get_jwt_identity()
    user = db.session.get(User,user_id)

    if not user:
        return jsonify({'error':'User not found'}),404
    if str(user.id) == current_admin_jwt['id']:
        return jsonify({'error':'Admin cannot fetch its account information here'}),403
    if user.user_type == 'patient':
        return jsonify(patient_schema.dump(user)), 200
    elif user.user_type == 'nutritionist':
        return jsonify(nutritionist_schema.dump(user)), 200
    
    return jsonify(user_schema.dump(user)), 200

@bp_admin.route('/users/<int:user_id>', methods=['PUT']) #update
@admin_required
@permission_required('manage_users')
def update_user(user_id):
    current_admin = get_jwt_identity()
    target_user = db.session.get(User,user_id)    
    data = request.get_json()

    if not target_user:
        return jsonify({'error': 'User not found'}), 404

    # admin cannot update himself here
    if str(target_user.id) == current_admin['id'] and target_user.user_type == 'admin':
        return jsonify({'error':'Admins cannot update their own accounts here'}),403
        
    allowed_fields = ['full_name', 'phone', 'image']
    for field in allowed_fields:
        if field in data:
            setattr(target_user,field,data[field])
    
    if target_user.user_type == 'patient':
        patient_fields = ['weight', 'height', 'age', 'weight_goal']
        for field in patient_fields:
            if field in data:
                setattr(target_user, field, data[field])

    if target_user.user_type == 'nutritionist':
        nutritionist_fields = ['specialty', 'bio', 'years_of_experience', 'availability']
        for field in nutritionist_fields:
            if field in data:
                setattr(target_user, field, data[field])

    db.session.commit()
    return jsonify({'message':'user updated successfully.'}), 200

@bp_admin.route('/users/<int:user_id>', methods=['DELETE']) #delete -> this is only deactivate the account not actual deletion from db
@admin_required
@permission_required('manage_users')
def soft_delete_user(user_id):
    current_admin = get_jwt_identity()
    target_user = db.session.get(User,user_id)
    data = request.get_json() or {}

    if not target_user:
        return jsonify({'error':'User not found'}),404

    if str(target_user.id) == current_admin['id']:
        return jsonify({'error':'Admins cannot delete their own accounts'}),403
    
    if target_user.user_type == 'admin':
        return jsonify({'message':'only super admin who can apply deletion for other admin accounts'}), 403


    if target_user.status == StatusEnum.INACTIVE:
        return jsonify({'message':'User account is already deactivated.'}), 400

    old_status = target_user.status
    target_user.status = StatusEnum.INACTIVE
    db.session.commit()

    log_status_change(
        user_id=uuid.UUID(target_user.id),
        old_status=old_status,
        new_status=StatusEnum.INACTIVE,
        changed_by=uuid.UUID(get_jwt_identity()['id']),
        reason=data.get('reason', 'soft deleted by admin')
    )

    send_deleted_account_notification(target_user)
    return jsonify({'message':'User account has been deleted successfully (desactivated).'}), 200

@bp_admin.route('/users/<int:user_id>', methods=['PUT']) # from activated account to banned account
@admin_required
@permission_required('manage_users')
def ban_user(user_id): # this function will modified
    current_admin = get_jwt_identity()
    target_user = db.session.get(User,user_id)
    data = request.get_json() or {}

    if not target_user:
        return jsonify({'error':'User not found'}),404

    if str(target_user.id) == current_admin['id']:
        return jsonify({'error':'Admins cannot bann their own accounts'}),403
    
    if target_user.user_type == 'admin':
        return jsonify({'message':'Only the main administrator has the authority to block other administrators'}), 403

    if target_user.status == StatusEnum.BANNED:
        return jsonify({'message':'User account is already blocked.'}), 400

    old_status = target_user.status
    target_user.status = StatusEnum.BANNED
    db.session.commit()

    log_status_change(
        user_id=uuid.UUID(target_user.id),
        old_status=old_status,
        new_status=StatusEnum.BANNED,
        changed_by=uuid.UUID(get_jwt_identity()['id']),
        reason=data.get('reason', 'soft deleted by admin')
    )

    send_block_account_notification(target_user)
    return jsonify({'message':'User account has been blocked successfully.'}), 200

@bp_admin.route('/users/<string:user_id>/logs', methods=['GET'])
@admin_required
def get_user_logs(user_id):
    target_user = db.session.get(User, user_id)  # confirm user exists
    if not target_user:
        return jsonify({'error':'target use does not exists.'}), 400
    if target_user.user_type == 'admin':
        return jsonify({'error':'you cannot fetch your own status log.'}), 403
    logs = db.session.execute(
            select(StatusLog).filter_by(id=user_id).\
            order_by(StatusLog.changed_at.desc()).all()
        ).scalars().all()
    return jsonify(log_schema.dump(logs)), 200

@bp_admin.route('/users/<int:user_id>/status', methods=['PUT'])
@admin_required
@permission_required('manage_user_status')
def change_user_status(user_id):
    current_admin = get_jwt_identity()
    data    = request.get_json()
    user    = db.session.get(User,user_id)
    old     = user.status
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if current_admin['id'] == str(user.id) and user.user_type == 'admin':
        return jsonify({'error':'admin cannot update himself'}), 403
    
    if data['status'].upper() not in StatusEnum.__members__:
        return jsonify({'error':'Invalid status value'}),400
    
    user.status = data['status']
    db.session.commit()

    # Always log the change
    log_status_change(
        user_id    = uuid.UUID(user.id),
        old_status = old,
        new_status = data['status'],
        changed_by = uuid.UUID(get_jwt_identity()['id']),
        reason     = data.get('reason', '')
    )

    return jsonify({'message': f'Status changed from {old} to {user.status}',
                    'reason': data.get('reason', '')}), 200

@bp_admin.route('/users/admins', methods=['GET'])
@admin_required
@super_admin_required
@permission_required('view_users')
def list_admins():
    admins = db.session.execute(select(Admin)).scalars().all()
    return jsonify(admin_schema.dump(admins, many=True)), 200

@bp_admin.route('/users/admins', methods=['POST']) # create
@admin_required
@super_admin_required
@permission_required('manage_users')
def create_admin():
    schema = AdminSignInSchema()
    data = request.get_json()
    loaded_data = None
    if not data:
        return jsonify({'error':'You request has no data'}),400
    
    try:
        loaded_data = schema.load(data)
    except ValidationError as err:
        return jsonify({'error':err.messages}), 400
    
    hashed_pass = bc.generate_password_hash(loaded_data['password']).decode('utf-8')

    new_admin = Admin(
        full_name      = loaded_data['full_name'],
        email          = loaded_data['email'],
        password       = hashed_pass,
        phone          = loaded_data.get('phone'),
        status         = StatusEnum.ACTIVE,
        is_super_admin = loaded_data.get('is_super_admin', False)
    )
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({'message':'Admin user has been created successfuly'}), 200

@bp_admin.route('/users/admins/<int:user_id>/permissions',methods=['POST'])
@admin_required
@super_admin_required
def update_admin_permissions(user_id):
    current_admin = get_jwt_identity()
    target_admin  = db.session.get(Admin,user_id)
    data          = request.get_json()
    if not target_admin:
        return jsonify({'error': 'User not found'}), 404 
    if str(target_admin.id) == current_admin['id']:
        return jsonify({'error': 'Cannot edit your own permissions'}), 403

    permissions = data.get('permissions',[])
    valid_permissions = [PermissionEnum[perm.upper()] for perm in permissions]
    target_admin.permissions = db.session.query(Permission).filter(Permission.name.in_(valid_permissions)).all()
    db.session.commit()

    return jsonify(admin_schema.dump(target_admin)), 200

@bp_admin.route('/users/admins/<int:user_id>',methods=['DELETE'])
@admin_required
@super_admin_required
def delete_admin(user_id):
    current_admin = get_jwt_identity()
    target_admin = db.session.get(Admin,user_id)
    
    if not target_admin:
        return jsonify({'error': 'User not found'}), 404
    if current_admin['id'] == str(target_admin.id):
        return jsonify({'error': 'Admins cannot delete their own accounts'}), 403
    
    old_status = target_admin.status
    target_admin.status = StatusEnum.INACTIVE
    db.session.commit()
    
    log_status_change(
        user_id=uuid.UUID(target_admin.id),
        old_status=old_status,
        new_status=StatusEnum.INACTIVE,
        changed_by=uuid.UUID(current_admin['id']),
        reason='soft deleted by super admin'
    )
    send_deleted_account_notification(target_admin)
    return jsonify({'message': 'Admin account has been deleted successfully (desactivated).'}), 200

@bp_admin.route('/users/nutritionists/<int:user_id>/status', methods=['PUT']) # approve
@admin_required
@permission_required('approve_nutritionist')
def approve_nutritionist(user_id):
    nutritionist        = db.session.get(User,user_id)
    if not nutritionist:
        return jsonify({'error': 'User not found'}), 404
    if nutritionist.user_type != 'nutritionist':
        return jsonify({'error': 'User is not a nutritionist'}), 400
    
    if nutritionist.status == StatusEnum.ACTIVE:
        return jsonify({'message': 'Nutritionist is already approved'}), 200
    
    old_status = nutritionist.status
    nutritionist.status = StatusEnum.ACTIVE
    db.session.commit()
    log_status_change(
        user_id=uuid.UUID(nutritionist.id),
        old_status=old_status,
        new_status=StatusEnum.ACTIVE,
        changed_by=uuid.UUID(get_jwt_identity()['id']),
        reason='approved as nutritionist'
    )
    send_apporval_notification(nutritionist)
    return jsonify({'message': 'Nutritionist approved and received an email notification'}),200

@bp_admin.route('users/nutritionists/<int:user_id>/status', methods=['PUT']) # reject
@admin_required
@permission_required('approve_nutritionist')
def reject_nutritionist(user_id):
    nutritionist        = db.session.get(User,user_id)
    if not nutritionist:
        return jsonify({'error': 'User not found'}), 404
    if nutritionist.user_type != 'nutritionist':
        return jsonify({'error': 'User is not a nutritionist'}), 400
    if nutritionist.status == 'rejected':
        return jsonify({'message': 'Nutritionist is already rejected'}), 200
    old_status = nutritionist.status
    nutritionist.status = StatusEnum.INACTIVE
    log_status_change(
        user_id=uuid.UUID(nutritionist.id),
        old_status=old_status,
        new_status=StatusEnum.INACTIVE,
        changed_by=uuid.UUID(get_jwt_identity()['id']),
        reason='rejected as nutritionist'
    )
    send_rejected_notification(nutritionist)
    return jsonify({'message': 'Nutritionist rejected and received an email notification'})

@bp_admin.route('/users/nutritionists/<int:user_id>/', methods=['POST'])
@admin_required
@permission_required('manage_users')
def create_nutritionist():
    pass
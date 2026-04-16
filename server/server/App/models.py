import enum
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    String,
    Integer,
    Enum,
    ForeignKey,
    DateTime,
    Text,
    Boolean,
    Float,
    Column
)
from typing import List, Optional
from flask import current_app, jsonify
from itsdangerous import URLSafeTimedSerializer as Serializer, SignatureExpired, BadSignature
from App.extensions import db, Base


class PermissionEnum(enum.Enum):
    MANAGEUSERS = "manage_users"      
    MANAGECONTENT = "manage_content"
    MANAGENUTRITIONISTS = "manage_nutritionists"
    VIEWFEEDBACK = "view_feedback"
    VIEWSTATISTICS = "view_statistics"

class GenderEnum(enum.Enum):
    MALE   = "male"
    FEMALE = "female"
    OTHER  = "other"

class StatusEnum(enum.Enum):
    ACTIVE   = "active"
    INACTIVE = "inactive"
    PENDING  = "pending"
    BANNED   = "banned"
    

class User(Base): 

    __mapper_args__ = {
        "polymorphic_on":       "user_type",
        "polymorphic_identity": "user" # allow SQLAlchemy will automatically set user_type = "user"
    }

    __tablename__ = 'users'
    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4)
    full_name:Mapped[str] = mapped_column(String(100), nullable=False)
    email:Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password:Mapped[str] = mapped_column(String(255), nullable=False)
    phone:Mapped[Optional[str]] = mapped_column(String(20),  nullable=True)
    status:Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), default=StatusEnum.ACTIVE)
    image:Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at:Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)      

    #user_type column is only to tell SQLAlchemy which Python class to instantiate when it loads a row from the users table.
    user_type:Mapped[str] = mapped_column(String(50), nullable=False) 
    #without it:
    #running of this query: SELECT * FROM users WHERE id = 'some-uuid';
    # It gets back a row. But now it has a problem:
    # "Should I return this as a User object? A Client object? A Nutritionist object?"

    # Link to role-specific profile uselist=False -> means one to one relaionship
    admin_profile        = db.relationship('Admin', backref='user', uselist=False) 
    nutritionist_profile = db.relationship('Nutritionist', backref='user', uselist=False)
    patient_profile      = db.relationship('Patient', backref='user', uselist=False)


    def to_dict(self):
        return {
            'id': str(self.id),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'status': self.status.value if self.status else None,
            'image_path': self.image,
        }

    def get_reset_token(self):
        s = Serializer(current_app.config['SECRET_KEY'],
                       salt=current_app.config['RESET_PASSWORD_SALT']
                       )    
        return s.dumps(str(self.id)) #generate the token

    @staticmethod
    def check_reset_token(token):
        allowed_duration = current_app.config['RESET_TOKEN_EXPIRE']
        s = Serializer(current_app.config['SECRET_KEY'],
                        salt=current_app.config['RESET_PASSWORD_SALT']
                       )
        try:
            user_id = s.loads(token,max_age=allowed_duration)
        except SignatureExpired:
            return jsonify({'message': 'Token Expired'}),400
        except BadSignature:
            return jsonify({'message': 'Invalid Reset Link'}),400
        return db.session.get(User,user_id)

class Patient(User):

    __mapper_args__ = {"polymorphic_identity": "patient"}

    __tablename__ = 'patients'
    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    weight: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    height: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gender: Mapped[Optional[GenderEnum]] = mapped_column(Enum(GenderEnum), nullable=True)
    #----medical target & tracking-----
    weight_goal: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    appointment_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    diet_plan: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    nutritionist_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("nutritionists.id", ondelete="CASCADE"), nullable=True
    )
    nutritionist:Mapped[Optional["Nutritionist"]] = relationship('Nutritionist',
                                                                back_populates='patients',
                                                                foreign_keys=[nutritionist_id]
                                                                )

class Nutritionist(User):
    __mapper_args__ = {"polymorphic_identity": "nutritionist"}

    __tablename__ = 'nutritionists'
    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    specialty:Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    bio:Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    years_of_experience:Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status:Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), default=StatusEnum.PENDING)
    availability: Mapped[bool] = mapped_column(Boolean, default=True)
    # Admin check fields
    license_number = mapped_column(String(100), nullable=False)
    license_issuer = mapped_column(String(200), nullable=False)
    license_expiry = mapped_column(DateTime, nullable=False)
    license_doc    = mapped_column(String(255), nullable=False)
    # Admin review fields
    reviewed_by    = mapped_column(ForeignKey('users.id'), nullable=True)  # admin id
    reviewed_at    = mapped_column(DateTime, nullable=True)
    reject_reason  = mapped_column(String(255), nullable=True)


    patients: Mapped[List["Patient"]] = relationship(
        "Patient",
        back_populates="nutritionist",
        foreign_keys="[Patient.nutritionist_id]"
    )

class Admin(User):

    __mapper_args__ = {"polymorphic_identity": "admin"}

    __tablename__ = "admins"

    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    is_super_admin: Mapped[bool] = mapped_column(Boolean, default=False)

    permissions = db.relationship('Permission', 
                                  secondary='admin_permissions', 
                                  backref='admins'
                                )


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    name: Mapped[PermissionEnum] = mapped_column(
        Enum(PermissionEnum, name="permission_enum"), 
        #the name's attribute is the name of type which will be created
        unique=True,
        nullable=False,
        native_enum=True # allow the to apply the restrictions of this values on database level
    )
    description: Mapped[str] = mapped_column(String(255), nullable=True)


admin_permissions = db.Table('admin_permissions',
    Base.metadata,
    Column('admin_id', UUID(as_uuid=True), db.ForeignKey('admins.id'),primary_key=True),
    Column('permission_id', UUID(as_uuid=True), db.ForeignKey('permissions.id'))
)

class StatusLog(Base):
    """Audit trail for every status change"""
    __tablename__ = 'status_logs'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    old_status: Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), nullable=False)    
    new_status: Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), nullable=False)
    changed_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    reason: Mapped[str] = mapped_column(String(255)) # admin who did it
    changed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
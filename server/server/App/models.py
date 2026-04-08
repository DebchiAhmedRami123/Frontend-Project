import enum
from datetime import datetime
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase,Mapped, mapped_column, relationship
from sqlalchemy import (
    String,
    Integer,
    Enum,
    ForeignKey,
    DateTime,
    Text,
    Boolean,
    Float
)
from typing import List, Optional
from flask import current_app, jsonify
from itsdangerous import URLSafeTimedSerializer as Serializer, SignatureExpired, BadSignature


class Base(DeclarativeBase):
    def __repr__(self):
        cols = [f"{c}={getattr(self, c)}" for c in self.__mapper__.columns.keys()]
        return f"{self.__class__.__name__}({', '.join(cols)})"

db = SQLAlchemy(model_class=Base)

class GenderEnum(enum.Enum):
    male   = "male"
    female = "female"
    other  = "other"


class StatusEnum(enum.Enum):
    active   = "active"
    inactive = "inactive"
    banned   = "banned"


class User(Base):

    __mapper_args__ = {
        "polymorphic_on":       "user_type",
        "polymorphic_identity": "user"
    }

    __tablename__ = 'users'
    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4)
    first_name:Mapped[str] = mapped_column(String(100), nullable=False)
    last_name:Mapped[str] = mapped_column(String(100), nullable=False)
    email:Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password:Mapped[str] = mapped_column(String(255), nullable=False)
    phone:Mapped[Optional[str]] = mapped_column(String(20),  nullable=True)
    status:Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), default=StatusEnum.active)
    image:Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at:Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user_type:Mapped[str] = mapped_column(String(50), nullable=False)

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
        return s.dumps(str(self.id))

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


class Client(User):

    __mapper_args__ = {"polymorphic_identity": "client"}

    __tablename__ = 'client'
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
                                                                     back_populates='clients',
                                                                    foreign_keys=[nutritionist_id]
                                                                  )

class Nutritionist(User):
    __mapper_args__ = {"polymorphic_identity": "nutritionist"}

    __tablename__ = 'nutritionists'
    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    specialty:Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    bio:Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    years_of_experience:Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    availability: Mapped[bool] = mapped_column(Boolean, default=True)

    clients: Mapped[List["Client"]] = relationship(
        "Client",
        back_populates="nutritionist",
        foreign_keys="[Client.nutritionist_id]"
    )

class Admin(User):

    __mapper_args__ = {"polymorphic_identity": "admin"}

    __tablename__ = "admins"

    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)

    # ── Permission flags ──
    manage_users:         Mapped[bool] = mapped_column(Boolean, default=True)
    manage_content:       Mapped[bool] = mapped_column(Boolean, default=True)
    manage_nutritionists: Mapped[bool] = mapped_column(Boolean, default=True)
    view_feedback:        Mapped[bool] = mapped_column(Boolean, default=True)
    view_statistics:      Mapped[bool] = mapped_column(Boolean, default=True)

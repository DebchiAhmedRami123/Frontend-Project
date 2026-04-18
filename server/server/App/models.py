import enum
from datetime import datetime
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from App.extensions import db, Base
from sqlalchemy import (
    String,
    Integer,
    Enum,
    ForeignKey,
    DateTime,
    Text,
    Boolean,
    Float,
    JSON,
    Table,
    Column
)
from typing import List, Optional
from flask import current_app, jsonify
from itsdangerous import URLSafeTimedSerializer as Serializer, SignatureExpired, BadSignature

# ── Base Configuration ──────────────────────────────────────────────────────────

# Base and db moved to extensions.py

# ── Enums ──────────────────────────────────────────────────────────────────────

class GenderEnum(enum.Enum):
    male   = "male"
    female = "female"
    other  = "other"

class StatusEnum(enum.Enum):
    active   = "active"
    pending  = "pending"
    rejected = "rejected"
    inactive = "inactive"
    banned   = "banned"

class MealTypeEnum(enum.Enum):
    breakfast = "breakfast"
    lunch     = "lunch"
    dinner    = "dinner"
    snack     = "snack"

class User(Base):
    __tablename__ = 'users'
    __mapper_args__ = {
        "polymorphic_on": "user_type",
        "polymorphic_identity": "user"
    }

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    status: Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), default=StatusEnum.pending)
    image: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user_type: Mapped[str] = mapped_column(String(50), nullable=False)

    # Common fields that might be used as properties
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    # Relationships
    profile: Mapped[Optional["ClientProfile"]] = relationship("ClientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    nutritionist_profile: Mapped[Optional["NutritionistProfile"]] = relationship("NutritionistProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    meals: Mapped[List["Meal"]] = relationship("Meal", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        data = {
            'id': str(self.id),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'status': self.status.value if self.status else None,
            'image': self.image,
            'user_type': self.user_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        return data

    def get_reset_token(self):
        s = Serializer(current_app.config['SECRET_KEY'], salt=current_app.config['RESET_PASSWORD_SALT'])
        return s.dumps(str(self.id))

    @staticmethod
    def check_reset_token(token):
        s = Serializer(current_app.config['SECRET_KEY'], salt=current_app.config['RESET_PASSWORD_SALT'])
        try:
            user_id = s.loads(token, max_age=1800)
        except (SignatureExpired, BadSignature):
            return None
        return db.session.get(User, user_id)

class Patient(User):
    __tablename__ = 'patients'
    __mapper_args__ = {"polymorphic_identity": "client"}
    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    
    gender: Mapped[Optional[GenderEnum]] = mapped_column(Enum(GenderEnum), nullable=True)
    birth_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    height: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    weight: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    weight_goal: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    nutritionist_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("nutritionists.id"), nullable=True)

class Admin(User):
    __mapper_args__ = {"polymorphic_identity": "admin"}

class PendingNutritionist(User):
    __mapper_args__ = {"polymorphic_identity": "pending_nutritionist"}

class Nutritionist(User):
    __tablename__ = 'nutritionists'
    __mapper_args__ = {"polymorphic_identity": "nutritionist"}
    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    
    license_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    specialty: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    years_of_experience: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    license_doc: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    availability: Mapped[bool] = mapped_column(Boolean, default=True)

class ClientProfile(Base):
    __tablename__ = 'client_profiles'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    goal: Mapped[Optional[str]] = mapped_column(String(100))
    activity_level: Mapped[Optional[str]] = mapped_column(String(50))
    target_calories: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user: Mapped["User"] = relationship("User", back_populates="profile")

    def to_dict(self):
        return {
            'goal': self.goal,
            'activity_level': self.activity_level,
            'target_calories': self.target_calories
        }

class NutritionistProfile(Base):
    __tablename__ = 'nutritionist_profiles'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    title: Mapped[Optional[str]] = mapped_column(String(100), default="Nutritionist")
    specialization: Mapped[Optional[str]] = mapped_column(String(200))
    bio: Mapped[Optional[str]] = mapped_column(Text)
    years_of_experience: Mapped[Optional[int]] = mapped_column(Integer)
    price_initial: Mapped[float] = mapped_column(Float, default=0.0)
    price_monthly: Mapped[float] = mapped_column(Float, default=0.0)
    price_followup: Mapped[float] = mapped_column(Float, default=0.0)
    rating: Mapped[float] = mapped_column(Float, default=5.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    profile_image: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default='pending')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user: Mapped["User"] = relationship("User", back_populates="nutritionist_profile")

    def to_dict(self):
        return {
            'title': self.title,
            'specialization': self.specialization,
            'bio': self.bio,
            'years_of_experience': self.years_of_experience,
            'price_initial': self.price_initial,
            'price_monthly': self.price_monthly,
            'price_followup': self.price_followup,
            'rating': self.rating,
            'review_count': self.review_count,
            'profile_image': self.profile_image,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# ── Meals & Food Tracking ──────────────────────────────────────────────────────

class Meal(Base):
    __tablename__ = 'meals'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    meal_type: Mapped[MealTypeEnum] = mapped_column(Enum(MealTypeEnum), nullable=False)
    total_calories: Mapped[float] = mapped_column(Float, default=0.0)
    total_protein: Mapped[float] = mapped_column(Float, default=0.0)
    total_carbs: Mapped[float] = mapped_column(Float, default=0.0)
    total_fats: Mapped[float] = mapped_column(Float, default=0.0)
    image_url: Mapped[Optional[str]] = mapped_column(Text)
    logged_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    user: Mapped["User"] = relationship("User", back_populates="meals")
    food_items: Mapped[List["FoodItem"]] = relationship("FoodItem", back_populates="meal", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'meal_type': self.meal_type.value,
            'total_calories': self.total_calories,
            'total_protein': self.total_protein,
            'total_carbs': self.total_carbs,
            'total_fats': self.total_fats,
            'image_url': self.image_url,
            'logged_at': self.logged_at.isoformat(),
            'food_items': [item.to_dict() for item in self.food_items]
        }

class FoodItem(Base):
    __tablename__ = 'food_items'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("meals.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[Optional[float]] = mapped_column(Float)
    unit: Mapped[Optional[str]] = mapped_column(String(50))
    calories: Mapped[float] = mapped_column(Float, default=0.0)
    protein: Mapped[float] = mapped_column(Float, default=0.0)
    carbs: Mapped[float] = mapped_column(Float, default=0.0)
    fats: Mapped[float] = mapped_column(Float, default=0.0)
    is_ai_detected: Mapped[bool] = mapped_column(Boolean, default=False)
    confidence_score: Mapped[Optional[float]] = mapped_column(Float)
    
    meal: Mapped["Meal"] = relationship("Meal", back_populates="food_items")

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats,
            'is_ai_detected': self.is_ai_detected
        }

from ..models import User, db
from marshmallow import ValidationError, validate, validates, validates_schema, EXCLUDE, Schema, fields, pre_load
from ..extensions import ma

class BaseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = False
        unknown = EXCLUDE

class SignSchema(BaseSchema):
    id         = ma.auto_field(dump_only=True)
    created_at = ma.auto_field(dump_only=True)
    user_type  = ma.auto_field(dump_only=True)
    status     = ma.auto_field(dump_only=True)

    email = ma.auto_field(required=True, validate=validate.Email())
    phone = ma.auto_field(required=False, validate=[validate.Regexp(r'^(?:\+213|0)(5|6|7)[0-9]{8}$')])
    password = ma.auto_field(required=True, load_only=True,
                             validate=[validate.Length(min=8, max=50),
                                    validate.Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$',
                                    error="Password must contain at least one lowercase, uppercase, digit, and special character")])

    @validates('first_name')
    def validate_first_name(self, data, **kwargs):
        if any(not (char.isalpha() or char == " ") for char in data):
            raise ValidationError("Name must not contain numbers")
        return data

    @validates('last_name')
    def validate_last_name(self, data, **kwargs):
        if any(not (char.isalpha() or char == " ") for char in data) or len(data) < 2:
            raise ValidationError("Name must not contain numbers/symbols and must be at least 2 characters")
        return data

    @pre_load
    def validate_email_unique(self, data, **kwargs):
        if db.session.query(User).filter(User.email == data.get('email')).first():
            raise ValidationError("Email already exists", field_name="email")
        return data

    @validates('password')
    def validate_password(self, data, **kwargs):
        pass

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=False, load_only=True)

class ResetPasswordSchema(Schema):
    token = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True,
                          validate=[validate.Length(min=8, max=50)])
    confirm_password = fields.Str(required=True, load_only=True)

    @validates_schema
    def validate_passwords_match(self, data, **kwargs):
        if data.get('password') != data.get('confirm_password'):
            raise ValidationError("Passwords must match", field_name="confirm_password")
from ..models import User,  Nutritionist, db
from marshmallow import ValidationError, validate, validates, validates_schema, EXCLUDE, Schema, fields, pre_load
from ..extensions import ma

class BaseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = False # return dicts instead of model instance
        unknown = EXCLUDE

class SignSchema(BaseSchema):
    # when we use fields.* we cancel the auto connection with SQLAlchemy model so we loss the reference type from the model and the metadata (nullable, length, etc)
    # while the using of ma.auto_field() allow to add the validators with the same they are defined in the model
    id         = ma.auto_field(dump_only=True)
    created_at = ma.auto_field(dump_only=True)
    status     = ma.auto_field(dump_only=True)
    image      = ma.auto_field(required=False, allow_none=True) #override the model validators for determine the optionality or we can exclude it directly  

    email = ma.auto_field(required=True, validate=validate.Email())
    phone = ma.auto_field(required=False, validate=[validate.Regexp(r'^(?:\+213|0)(5|6|7)[0-9]{8}$')])
    password = ma.auto_field(required=True, load_only=True,
                             validate=[validate.Length(min=8, max=50),
                                    validate.Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$',
                                    error="Password must contain at least one lowercase, uppercase, digit, and special character")])
    full_name = ma.auto_field(required=True, validate=[validate.Length(min=2, max=100)])

    @validates('full_name')
    def validate_full_name(self, data, **kwargs):
        if any(not (char.isalpha() or char == " ") for char in data) or len(data) < 2:
            raise ValidationError("Name must not contain numbers/symbols and must be at least 2 characters")

    @validates('email')
    def validate_email_unique(self, data, **kwargs):
        if db.session.query(User).filter(User.email == data).first():
            raise ValidationError("Email already exists", field_name="email")

class AdminSignInSchema(SignSchema):
    is_super_admin = ma.auto_field(required=False, dump_only=True)
    
class LoginSchema(BaseSchema):
    email = ma.auto_field(required=True)
    password = ma.auto_field(required=False, load_only=True)

class ResetPasswordSchema(BaseSchema):
    token = fields.Str(required=True)
    password = ma.auto_field(required=True, load_only=True,
                          validate=[validate.Length(min=8, max=50)])
    confirm_password = ma.auto_field(required=True, load_only=True)

    @validates_schema
    def validate_passwords_match(self, data, **kwargs):
        if data.get('password') != data:
            raise ValidationError("Passwords must match", field_name="confirm_password")
        
class PatientRoleSchema(BaseSchema):
    diet_plan = ma.auto_field(dump_only=True)
    appointment_date = ma.auto_field(dump_only=True)

    weight = ma.auto_field(required=True, validate=validate.Range(min=5))
    height = ma.auto_field(required=True, validate=validate.Range(min=80))
    age    = ma.auto_field(required=True, validate=validate.Range(min=0))
    gender = ma.auto_field(required=True, validate=validate.OneOf(["male", "female", "other"]))
    weight_goal = ma.auto_field(required=True, validate=validate.Range(min=5))

class NutritionistRoleSchema(BaseSchema):
    class Meta:
        model = Nutritionist
        load_instance = False
        fields = ( # this only the allowed fields to retrieved from the model and serialized, the rest will be ignored
            'specialty', 'years_of_experience', 'license_number', 'license_issuer', 'license_expiry', 'license_doc' 
        )



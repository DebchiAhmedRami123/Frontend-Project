from flask_marshmallow import Marshmallow  as ma
from App.models import User, StatusLog, Patient, Nutritionist, Admin, Permission
from App.extensions import ma

# we use SQLAlchemyAutoSchema to automatically generate fields based on the model so we not define them manually (when we extends from ma.Schema)
# and the Meta.fields collect only the disired fields to be included in the schema output, and we can also use exclude to specify the fields to be excluded from the output instead of including them one by one with fields
# Meta.fields acts as a strict whitelist — only what you list there gets out, regardless of what SQLAlchemyAutoSchema can see
class UserSchema(ma.SQLAlchemyAutoSchema): #used = 1,2
    user_type = ma.auto_field(dump_only=True) # role field is determined by the model's polymorphic identity, so we set it as dump_only
    status = ma.Method('get_status')
    def get_status(self, obj):
        return obj.status.value if obj.status else None
    class Meta:
        model = User
        include_instance = True
        fields = (
            'id', 'email', 'full_name', 'phone', 'user_type', 'image', 'status',
            'created_at', 'admin_profile'
        )

class PatientSchema(ma.SQLAlchemyAutoSchema):# used = 1
    def get_gender(self, obj):
        return obj.gender.value if obj.gender else None

    class Meta(UserSchema.Meta):
        model = Patient
        include_instance = True
        fields = UserSchema.Meta.fields + (
            'weight', 'height', 'age', 'gender', 'weight_goal'
        )

class NutritionistSchema(ma.SQLAlchemyAutoSchema): # used = 1
    class Meta(UserSchema.Meta):
        modele = Nutritionist
        include_instance = True
        fields = UserSchema.Meta.fields + (
            'id', 'license_number', 'specialty', 'years_of_experience', 'license_doc', 'availability'
        )

class StatusLogSchema(ma.SQLAlchemyAutoSchema):
    # this two fields return the column value as an enum object not string value
    # old_status = ma.auto_field()
    # new_status = ma.auto_field()

    # this two fields use the functions below to return the string value of the enum instead of the enum object
    old_status = ma.Method('get_old_status')
    new_status = ma.Method('get_new_status')

    def get_old_status(self, obj):
        return obj.old_status.value if obj.old_status else None

    def get_new_status(self, obj):
        return obj.new_status.value if obj.new_status else None

    class Meta:
        model   = StatusLog        
        load_instance = True
        fields  = (
            'id', 'user_id', 'old_status',
            'new_status', 'changed_by',
            'reason', 'changed_at'
        )

class PermissionSchema(ma.SQLAlchemyAutoSchema):
    name = ma.Method('get_name')
    def get_name(self, obj):
        return obj.name.value if obj.name else None
    
    class Meta:
        model = Permission
        include_instance = True
        fields = ('id', 'name', 'description')

class AdminProfileSchema(ma.SQLAlchemyAutoSchema):
    permissions = ma.Nested(PermissionSchema, many=True)

    class Meta(UserSchema.Meta):
        model  = Admin
        fields = UserSchema.Meta.fields + (
            'is_super_admin', 'permissions'
        )

permission_schema = PermissionSchema()
user_schema = UserSchema()
patient_schema = PatientSchema()
nutritionist_schema = NutritionistSchema()
log_schema = StatusLogSchema()
admin_schema = AdminProfileSchema()
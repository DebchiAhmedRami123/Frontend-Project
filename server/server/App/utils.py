from flask_jwt_extended import get_jwt_identity
from flask_mail import Message
from App.models import StatusEnum, User, Patient
from App.extensions import db
from flask import current_app, abort
from App.extensions import mail, redis
from sqlalchemy import update, insert, select

def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.get(User,user_id)
    if not user:
        return None
    return user

def send_reset_email(user):
    token = user.get_reset_token()
    reset_link = f"{current_app.config['FRONTEND_URL']}/Reset-Password?token={token}" 
    # this is the link of front end page for reset password and client must be send to server the token for verification
    mes =  Message('Password reset request',
                    sender="aouabdianaoufel@gmail.com",
                    recipients=[user.email],#can be more than one recipient
                 )
    mes.html = f'''
                    <h2>Password Reset</h2>
                    <p>You requested to reset your password. Click the link below:</p>
                    <a href="{reset_link}" style="
                        background:#4CAF50;
                        color:white;
                        padding:10px 20px;
                        text-decoration:none;
                        border-radius:5px;
                    ">
                        Reset My Password
                    </a>
                    <p>This link expires in <strong>15 minutes</strong>.</p>
                    <p>If you did not request this, ignore this email.</p>
                '''
    mail.send(mes)

def register_as_patient(user_id, client_data):
    #check the existence of the user
    user = db.execute(
        select(User).where(User.id == user_id) 
    ).scalar_one_or_none()     

    if not user:
        abort(404, description="User not found")
    
    # check if the user is already a client
    if user.user_type == "patient":
        abort(400, description="User is already a patient")

    #set the user_type to "Patient" in the users table
    db.execute(
        update(User)                      
        .where(User.id == user_id)        
        .values(user_type="patient")       
    )
    # add it into the Patient table with the same ID
    db.execute(
        insert(Patient).values(
            id=user_id,                             # Same ID as the user (FK link)
            weight=client_data.get("weight"),       
            height=client_data.get("height"),       
            age=client_data.get("age"),             
            weight_goal=client_data.get("weight_goal"), 
        )
    )
    db.commit()
    
    patient = db.execute(
        select(Patient).where(Patient.id == user_id)
    ).scalar_one()
    return patient

def register_as_nutritionist(user_id):
    nutritionist_data = redis.get(f"nutritionist_request:{user_id}").decode("utf-8")
    db.execute(
        update(User)                      
        .where(User.id == user_id)        
        .values(user_type="nutritionist",
                status=StatusEnum.ACTIVE)       
    )
    db.execute(
        insert(Nutritionist).values(
            id=user_id,
            bio=nutritionist_data.get("bio"),
            years_of_experience=nutritionist_data.get("years_of_experience"),
            specialty=nutritionist_data.get("specialty"),
        )
    )

    db.commit()

    Nutritionist = db.execute(
        select(Nutritionist).where(Nutritionist.id == user_id)
    ).scalar_one()

    return Nutritionist


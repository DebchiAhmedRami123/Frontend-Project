from flask_jwt_extended import get_jwt_identity
from flask_mail import Message
from App.models import db,User
from flask import current_app
from App.extensions import mail

def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.get(User,user_id)
    if user:
        return db.session.get(User,user_id)
    return None

def send_reset_email(user):
    token = user.get_reset_token()
    reset_link = f"{current_app.config['FRONTEND_URL']}/Reset-Password?token={token}"
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

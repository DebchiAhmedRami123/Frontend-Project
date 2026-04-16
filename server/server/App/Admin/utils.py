from App.models import StatusLog
from App.extensions import db
from datetime import datetime
from flask_mail import Message
from App.extensions import mail

def log_status_change(user_id, old_status, new_status, changed_by_id, reason=''):
    log = StatusLog(
        user_id    = user_id,
        old_status = old_status,
        new_status = new_status,
        changed_by = changed_by_id,
        reason     = reason,
        changed_at = datetime.utcnow()
    )
    db.session.add(log)
    db.session.commit()

def send_apporval_notification(user):
    mes =  Message('Approval notification',
        sender="aouabdianaoufel@gmail.com",
        recipients=[user.email],#can be more than one recipient
    )
    mail.send(mes)
    mes.html = \
    '''
        <div style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
            
                <!-- Overlay -->
            <div style="
                width:100%;
                height:100%;
                background:rgba(0,0,0,0.6);
                padding:40px 0;
            ">
            
                <!-- Popup Box -->
                <div style="
                    max-width:400px;
                    margin:0 auto;
                    background:#ffffff;
                    border-radius:10px;
                    padding:20px;
                    text-align:center;
                    box-shadow:0 5px 15px rgba(0,0,0,0.3);
                ">
      
                    <h2 style="color:#28a745;">✅ Approved!</h2>
      
                    <p style="color:#333; font-size:16px;">
                        Congratulations! Your request to become a 
                        <strong>Nutritionist</strong> has been approved.
                    </p>


                    <p style="color:#666; font-size:14px;">
                        You can now access all nutritionist features in your account.
                    </p>


                    <!-- Button -->
                    <a href="#"
                        style="
                        display:inline-block;
                        margin-top:15px;
                        padding:10px 20px;
                        background:#28a745;
                        color:#fff;
                        text-decoration:none;
                        border-radius:5px;
                        font-size:14px;
                    ">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    '''
    
def send_rejected_notification(user):
    mess = Message('Rejection notification',
                   sender='aouabdianaoufel@gmail.com',
                   recipients=[user.email])
    mess.html = '''
        <div>
            <!-- Overlay -->
            <div style="
                width:100%;
                height:100%;
                background:rgba(0,0,0,0.6);
                padding:40px 0;
            ">
        
            <!-- Popup Box -->
            <div style="
                max-width:400px;
                margin:0 auto;
                background:#ffffff;
                border-radius:10px;
                padding:20px;
                text-align:center;
                box-shadow:0 5px 15px rgba(0,0,0,0.3);
            ">
        
                <h2 style="color:#dc3545;">❌ Application Rejected</h2>
        
                <p style="color:#333; font-size:16px;">
                    We regret to inform you that your request to become a 
                    <strong>Nutritionist</strong> has been declined.
                </p>
        
                <p style="color:#666; font-size:14px;">
                    This may be due to incomplete or insufficient information.  
                    You can review your application and submit it again.
                </p>
        
                <!-- Button -->
                <a href="#"
                    style="
                    display:inline-block;
                    margin-top:15px;
                    padding:10px 20px;
                    background:#dc3545;
                    color:#fff;
                    text-decoration:none;
                    border-radius:5px;
                    font-size:14px;
                ">
                    Review Application
                </a>
            </div>
        </div>
    </div>
    '''
    mail.send(mess)

def send_deleted_account_notification(user):
    mess = Message(subject="Your Account has been deleted",
                   recipients=[user.email],
                   sender="aouabdianaoufel@gmail.com")
    
    mess.html = '''
        <div style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
            <!-- Overlay -->
            <div style="
                width:100%;
                height:100%;
                background:rgba(0,0,0,0.6);
                padding:40px 0;
            ">
                <!-- Popup Box -->
                <div style="
                    max-width:400px;
                    margin:0 auto;
                    background:#ffffff;
                    border-radius:10px;
                    padding:25px;
                    text-align:center;
                    box-shadow:0 5px 15px rgba(0,0,0,0.3);
                ">
                    <h2 style="color:#6c757d;">🗑️ Account Deleted</h2>
                    <p style="color:#333; font-size:16px;">
                        Your account has been <strong>successfully deleted</strong>.
                    </p>
                    <p style="color:#666; font-size:14px;">
                        All associated data has been permanently removed from our system.
                    </p>
                    <p style="color:#999; font-size:13px;">
                        If this action was not initiated by you, please contact support immediately.
                    </p>

                </div>
            </div>
        </div>
    '''
    mail.send(mess)

def send_block_account_notification(user):
    pass
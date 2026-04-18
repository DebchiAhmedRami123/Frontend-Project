from App import create_app
from App.models import db, User, Patient
from sqlalchemy import text

app = create_app()
with app.app_context():
    users = db.session.query(User).all()
    patient_ids = [p.id for p in db.session.query(Patient).all()]
    
    count = 0
    for u in users:
        if u.user_type == 'client' and u.id not in patient_ids:
            # Insert into patients table
            db.session.execute(text(f"INSERT INTO patients (id) VALUES ('{u.id}')"))
            count += 1
            
    db.session.commit()
    print(f"Patched {count} legacy clients with a patients table row!")
from App import create_app
from App.models import db

app = create_app()
with app.app_context():
    try:
        db.session.execute(db.text(
            "ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS profile_image TEXT"
        ))
        db.session.commit()
        print("Migration successful: profile_image (TEXT) added to client_profiles.")
    except Exception as e:
        db.session.rollback()
        print(f"Migration error: {e}")

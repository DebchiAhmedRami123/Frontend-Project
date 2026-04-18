from App import create_app
from App.models import db

app = create_app()
with app.app_context():
    try:
        db.session.execute(db.text(
            "ALTER TABLE nutritionist_profiles ADD COLUMN IF NOT EXISTS availability JSONB"
        ))
        db.session.execute(db.text(
            "ALTER TABLE nutritionist_profiles ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255)"
        ))
        db.session.commit()
        print("Migration successful: missing columns added to nutritionist_profiles.")
    except Exception as e:
        db.session.rollback()
        print(f"Migration error: {e}")

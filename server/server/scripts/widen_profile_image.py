from App import create_app
from App.models import db

app = create_app()
with app.app_context():
    try:
        db.session.execute(db.text(
            "ALTER TABLE nutritionist_profiles ALTER COLUMN profile_image TYPE TEXT"
        ))
        db.session.commit()
        print("Migration successful: profile_image widened to TEXT.")
    except Exception as e:
        db.session.rollback()
        print(f"Migration error: {e}")

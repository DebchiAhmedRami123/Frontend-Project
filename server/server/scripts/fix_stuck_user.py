"""
Fix script: resets any user who has user_type='nutritionist' but no nutritionist_profile
back to 'pending_nutritionist' so they can resubmit their application.
"""
from App import create_app
from App.models import db

app = create_app()
with app.app_context():
    try:
        # Find users who are 'nutritionist' but have no nutritionist_profile row
        result = db.session.execute(db.text("""
            UPDATE users
            SET user_type = 'pending_nutritionist'
            WHERE user_type = 'nutritionist'
            AND id NOT IN (
                SELECT user_id FROM nutritionist_profiles WHERE status = 'active'
            )
            RETURNING id, user_type
        """))
        rows = result.fetchall()
        db.session.commit()
        if rows:
            for row in rows:
                print(f"Reset user {row[0]} -> {row[1]}")
        else:
            print("No stuck users found.")
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")

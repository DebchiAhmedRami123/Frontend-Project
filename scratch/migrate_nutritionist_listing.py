import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'server', 'server'))

from App import create_app, db
from sqlalchemy import text

def run_migration():
    app = create_app()
    with app.app_context():
        print("Checking database schema...")
        try:
            # Add plan_features as JSONB for better performance on PG
            db.session.execute(text('ALTER TABLE nutritionist_profiles ADD COLUMN IF NOT EXISTS plan_features JSONB;'))
            # Add sample_plan_data as TEXT for base64
            db.session.execute(text('ALTER TABLE nutritionist_profiles ADD COLUMN IF NOT EXISTS sample_plan_data TEXT;'))
            db.session.commit()
            print("Migration successful: Added columns (if missing)")
        except Exception as e:
            print(f"Migration error: {e}")
            db.session.rollback()

if __name__ == "__main__":
    run_migration()

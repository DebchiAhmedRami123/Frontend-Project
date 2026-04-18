import sys
import os
import psycopg2

sys.path.append(os.path.join(os.getcwd(), 'server', 'server'))

from App import create_app, db
from sqlalchemy import text

def run_migration():
    app = create_app()
    with app.app_context():
        print("Running Phase 1 Migration: adding MarketplacePlan...")
        try:
            # 1. Add 'custom' to PackageTypeEnum
            db.session.execute(text("ALTER TYPE packagetypeenum ADD VALUE IF NOT EXISTS 'custom';"))
            db.session.commit()
            print("Updated enum")
        except Exception as e:
            print(f"Enum update error (might already exist): {e}")
            db.session.rollback()

        try:
            # 2. Create the marketplace_plans table
            db.create_all() # This will create any missing tables, like marketplace_plans
            print("Created missing tables")
        except Exception as e:
            print(f"Create tables error: {e}")
            db.session.rollback()

        try:
            # 3. Add plan_id to subscriptions
            db.session.execute(text("ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES marketplace_plans(id) ON DELETE SET NULL;"))
            db.session.commit()
            print("Added plan_id to subscriptions")
        except Exception as e:
            print(f"Alter subscriptions error: {e}")
            db.session.rollback()

if __name__ == "__main__":
    run_migration()

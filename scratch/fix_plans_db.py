import sys
import os

# Set PYTHONPATH to the directory containing 'App'
project_root = r"c:\Users\HP\Desktop\AI Calorie Estimation System Project\Frontend Project\server\server"
sys.path.append(project_root)

# Set the correct DB password from .env
os.environ["DB_password"] = "rami"

from App import create_app, db
from App.models import MarketplacePlan, User
from sqlalchemy import select, inspect

app = create_app()
with app.app_context():
    print("Checking database tables...")
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Tables found: {tables}")
    
    if 'marketplace_plans' not in tables:
        print("CRITICAL: Table 'marketplace_plans' is MISSING. Creating it now...")
        db.create_all()
        print("Table created.")
    else:
        print("Table 'marketplace_plans' exists.")
        
    # Check if any plans exist
    try:
        stmt = select(MarketplacePlan)
        plans = db.session.execute(stmt).scalars().all()
        print(f"Total MarketplacePlan records in DB: {len(plans)}")
        
        for p in plans:
            print(f" - Plan: '{p.title}', price: {p.price}, NutriID: {p.nutritionist_id}")
            
        # Also check nutritionists
        nutris = db.session.execute(select(User).where(User.user_type == 'nutritionist')).scalars().all()
        print(f"Approved Nutritionists: {len(nutris)}")
        for n in nutris:
            print(f" - Nutri: {n.first_name} {n.last_name}, ID: {n.id}")
            
    except Exception as e:
        print(f"Error checking plans: {e}")

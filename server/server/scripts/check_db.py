import sys
import os

# Add the project root to sys.path
sys.path.append(r'c:\Users\HP\Desktop\AI Calorie Estimation System Project\Frontend Project\server\server')

from App import create_app
from App.models import db, User

app = create_app()

with app.app_context():
    try:
        users = db.session.execute(db.select(User)).scalars().all()
        print(f"Total Users: {len(users)}")
        for user in users[:5]:
            print(f"- {user.first_name} {user.last_name} ({user.email}) - Type: {user.user_type}")
    except Exception as e:
        print(f"Error querying database: {e}")

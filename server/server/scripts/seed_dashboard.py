import uuid
from datetime import datetime, timedelta
from server.App.models import db, User, Client, Meal, FoodItem, MealTypeEnum, ClientProfile
from server.App.extensions import bc
from server.server import create_app

def seed_dashboard_data():
    app = create_app()
    with app.app_context():
        # 1. Get or create a test user
        email = "rami@example.com"
        user = User.query.filter_by(email=email).first()
        
        if not user:
            print(f"User {email} not found. Please register first.")
            return

        print(f"Seeding data for {user.first_name}...")

        # 2. Add some meals for today
        today = datetime.utcnow()
        
        meals_data = [
            {
                "name": "Protein Oatmeal",
                "type": MealTypeEnum.breakfast,
                "time": today.replace(hour=8, minute=30),
                "calories": 450,
                "protein": 30,
                "carbs": 60,
                "fats": 8,
                "items": [
                    {"name": "Oats", "cal": 300, "p": 10, "c": 50, "f": 5},
                    {"name": "Whey Protein", "cal": 150, "p": 20, "c": 10, "f": 3}
                ]
            },
            {
                "name": "Chicken & Quinoa Bowl",
                "type": MealTypeEnum.lunch,
                "time": today.replace(hour=13, minute=15),
                "calories": 650,
                "protein": 50,
                "carbs": 70,
                "fats": 15,
                "items": [
                    {"name": "Grilled Chicken", "cal": 350, "p": 40, "c": 0, "f": 10},
                    {"name": "Quinoa", "cal": 300, "p": 10, "c": 70, "f": 5}
                ]
            }
        ]

        # Clear existing meals for today to avoid duplicates during testing
        Meal.query.filter(Meal.user_id == user.id).delete()
        db.session.commit()

        for md in meals_data:
            meal = Meal(
                user_id=user.id,
                name=md["name"],
                meal_type=md["type"],
                total_calories=md["calories"],
                total_protein=md["protein"],
                total_carbs=md["carbs"],
                total_fats=md["fats"],
                logged_at=md["time"]
            )
            db.session.add(meal)
            db.session.flush()

            for idata in md["items"]:
                item = FoodItem(
                    meal_id=meal.id,
                    name=idata["name"],
                    calories=idata["cal"],
                    protein=idata["p"],
                    carbs=idata["c"],
                    fats=idata["f"],
                    is_ai_detected=True,
                    confidence_score=0.95
                )
                db.session.add(item)

        # 3. Add some history for the last 5 days
        for i in range(1, 6):
            past_date = today - timedelta(days=i)
            # Create a summary meal for the day
            hist_meal = Meal(
                user_id=user.id,
                name="Daily Summary",
                meal_type=MealTypeEnum.dinner,
                total_calories=1800 + (i * 50), # Varying calories
                total_protein=140,
                total_carbs=180,
                total_fats=60,
                logged_at=past_date
            )
            db.session.add(hist_meal)

        db.session.commit()
        print("Successfully seeded dashboard data!")

if __name__ == "__main__":
    seed_dashboard_data()

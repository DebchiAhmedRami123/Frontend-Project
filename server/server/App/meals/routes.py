from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from App.models import Meal, FoodItem, db, User, MealTypeEnum
from App.utils import get_current_user
from datetime import datetime, timedelta
from sqlalchemy import func
import os
import shutil

bp_meals = Blueprint('meals', __name__, url_prefix='/meals')

# Use absolute paths so image operations work regardless of CWD
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_SCANS_DIR = os.path.join(BASE_DIR, 'uploads', 'scans')
UPLOAD_MEALS_DIR = os.path.join(BASE_DIR, 'uploads', 'meals')
os.makedirs(UPLOAD_MEALS_DIR, exist_ok=True)

@bp_meals.route('/', methods=['POST'])
@jwt_required()
def log_meal():
    """
    Step 4: Save the confirmed meal and its items to the database.
    Also moves the temporary scan image to permanent storage.
    """
    user = get_current_user()
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    try:
        # Create the Meal record
        new_meal = Meal(
            user_id=user.id,
            name=data.get('name', 'New Meal'),
            meal_type=MealTypeEnum[data.get('meal_type', 'lunch')],
            total_calories=float(data.get('total_calories', 0)),
            total_protein=float(data.get('total_protein', 0)),
            total_carbs=float(data.get('total_carbs', 0)),
            total_fats=float(data.get('total_fats', 0))
        )
        # Handle Image persistence (Step 4 of pipeline)
        temp_image_path = data.get('image_path')
        # Resolve to absolute path if relative, checking both original and absolute
        abs_temp_path = None
        if temp_image_path:
            if os.path.isabs(temp_image_path) and os.path.exists(temp_image_path):
                abs_temp_path = temp_image_path
            else:
                # Try resolving relative to BASE_DIR (server/server/)
                candidate = os.path.join(BASE_DIR, temp_image_path)
                if os.path.exists(candidate):
                    abs_temp_path = candidate
                elif os.path.exists(temp_image_path):
                    abs_temp_path = os.path.abspath(temp_image_path)
        
        if abs_temp_path:
            filename = os.path.basename(abs_temp_path)
            permanent_path = os.path.join(UPLOAD_MEALS_DIR, filename)
            
            # Move the file from scans to meals
            shutil.move(abs_temp_path, permanent_path)
            # Store a URL-friendly path the frontend can use
            new_meal.image_url = f'/meals/image/{filename}'
            
        db.session.add(new_meal)
        db.session.flush() # Get the meal ID
        
        # Add individual FoodItems
        food_items_data = data.get('food_items', [])
        for item_data in food_items_data:
            item = FoodItem(
                meal_id=new_meal.id,
                name=item_data.get('name'),
                calories=float(item_data.get('calories', 0)),
                protein=float(item_data.get('protein', 0)),
                carbs=float(item_data.get('carbs', 0)),
                fats=float(item_data.get('fats', 0)),
                is_ai_detected=item_data.get('is_ai_detected', False),
                confidence_score=float(item_data.get('confidence_score', 0)) if item_data.get('confidence_score') else None
            )
            db.session.add(item)
            
        db.session.commit()
        print(f"Meal Logged: {new_meal.name} for User {user.email}")
        
        return jsonify({
            'message': 'Meal logged successfully',
            'meal': new_meal.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error logging meal: {str(e)}")
        return jsonify({'message': 'Failed to log meal', 'error': str(e)}), 500

@bp_meals.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    user = get_current_user()
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    # Handle date parameter for history
    date_str = request.args.get('date')
    if date_str:
        try:
            today = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            today = datetime.utcnow().date()
    else:
        today = datetime.utcnow().date()
    
    # 1. Today's Totals
    today_meals = db.session.query(Meal).filter(
        Meal.user_id == user.id,
        func.date(Meal.logged_at) == today
    ).all()
    
    consumed = {
        'calories': sum(m.total_calories for m in today_meals),
        'protein': sum(m.total_protein for m in today_meals),
        'carbs': sum(m.total_carbs for m in today_meals),
        'fats': sum(m.total_fats for m in today_meals)
    }
    
    # Target from profile
    target = {
        'calories': 2000,
        'protein': 150,
        'carbs': 200,
        'fats': 70
    }
    
    if user.user_type == 'client' and user.profile:
        target['calories'] = user.profile.target_calories or 2000
        # Simple macro split fallback if not explicitly in profile
        target['protein'] = int(round((target['calories'] * 0.3) / 4))
        target['carbs'] = int(round((target['calories'] * 0.4) / 4))
        target['fats'] = int(round((target['calories'] * 0.3) / 9))

    # 2. Last 7 Days History
    history = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_total = db.session.query(func.sum(Meal.total_calories)).filter(
            Meal.user_id == user.id,
            func.date(Meal.logged_at) == day
        ).scalar() or 0
        
        history.append({
            'date': day.strftime('%Y-%m-%d'),
            'label': day.strftime('%a'), # Mon, Tue...
            'calories': float(day_total),
            'met_goal': day_total > 0 and day_total <= target['calories']
        })

    return jsonify({
        'dailyProgress': {
            'calories': {'consumed': consumed['calories'], 'target': target['calories']},
            'macros': {
                'protein': {'consumed': consumed['protein'], 'target': target['protein']},
                'carbs': {'consumed': consumed['carbs'], 'target': target['carbs']},
                'fats': {'consumed': consumed['fats'], 'target': target['fats']}
            }
        },
        'history': history,
        'user': {
            'name': user.first_name,
            'goal': user.profile.goal if user.user_type == 'client' and user.profile else 'Health'
        }
    }), 200

@bp_meals.route('/today', methods=['GET'])
@jwt_required()
def get_today_meals():
    user = get_current_user()
    # Handle date parameter for history
    date_str = request.args.get('date')
    if date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            target_date = datetime.utcnow().date()
    else:
        target_date = datetime.utcnow().date()
    
    meals = db.session.query(Meal).filter(
        Meal.user_id == user.id,
        func.date(Meal.logged_at) == target_date
    ).order_by(Meal.logged_at.desc()).all()
    
    return jsonify([m.to_dict() for m in meals]), 200

@bp_meals.route('/<uuid:meal_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_meal(meal_id):
    user = get_current_user()
    meal = db.session.query(Meal).filter_by(id=meal_id, user_id=user.id).first()
    
    if not meal:
        return jsonify({'message': 'Meal not found'}), 404
        
    if request.method == 'GET':
        return jsonify(meal.to_dict()), 200
        
    if request.method == 'DELETE':
        db.session.delete(meal)
        db.session.commit()
        return jsonify({'message': 'Meal deleted successfully'}), 200
        
    if request.method == 'PUT':
        data = request.get_json()
        
        # Update meal fields
        meal.name = data.get('name', meal.name)
        meal.total_calories = float(data.get('total_calories', meal.total_calories))
        meal.total_protein = float(data.get('total_protein', meal.total_protein))
        meal.total_carbs = float(data.get('total_carbs', meal.total_carbs))
        meal.total_fats = float(data.get('total_fats', meal.total_fats))
        
        # Optional: handle updated food_items if provided
        # For simplicity, we replace them if provided
        if 'food_items' in data:
            # Remove old
            for item in meal.food_items:
                db.session.delete(item)
            # Add new
            for item_data in data['food_items']:
                item = FoodItem(
                    meal_id=meal.id,
                    name=item_data.get('name'),
                    calories=float(item_data.get('calories', 0)),
                    protein=float(item_data.get('protein', 0)),
                    carbs=float(item_data.get('carbs', 0)),
                    fats=float(item_data.get('fats', 0)),
                    is_ai_detected=item_data.get('is_ai_detected', False),
                    confidence_score=float(item_data.get('confidence_score', 0)) if item_data.get('confidence_score') else None
                )
                db.session.add(item)
                
        db.session.commit()
        return jsonify({'message': 'Meal updated successfully', 'meal': meal.to_dict()}), 200

@bp_meals.route('/image/<filename>', methods=['GET'])
def serve_meal_image(filename):
    """Serve uploaded meal images to the frontend."""
    return send_from_directory(UPLOAD_MEALS_DIR, filename)

@bp_meals.route('/history', methods=['DELETE'])
@jwt_required()
def clear_history():
    cur_user = get_current_user()
    if not cur_user:
        return jsonify({'message': 'User not found'}), 404
    
    # Delete all meals associated with the user
    # Due to 'delete-orphan' cascade in models.py, this will also delete FoodItems
    for meal in cur_user.meals:
        db.session.delete(meal)
    
    db.session.commit()
    return jsonify({'message': 'History cleared successfully'}), 200

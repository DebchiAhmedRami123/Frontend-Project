FOOD_DB = {"apple": {"calories": 52, "protein": 0.3, "carbs": 14, "fats": 0.2, "unit": "g"}}
def get_nutritional_info(name):
    return FOOD_DB.get(name.lower(), {"name": name.title(), "calories": 100, "protein": 5, "carbs": 10, "fats": 5, "unit": "unit"})

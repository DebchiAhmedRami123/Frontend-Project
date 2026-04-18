import os
import requests
from dotenv import load_dotenv

load_dotenv()

CALORIENINJAS_API_KEY = os.getenv("CALORIENINJAS_API_KEY")
API_URL = 'https://api.calorieninjas.com/v1/nutrition?query='

def get_nutrition_data(query):
    """
    Calls CalorieNinjas API to get nutritional information for a search query.
    Returns a dictionary of macros or None if not found/error.
    """
    if not CALORIENINJAS_API_KEY:
        print("Warning: CALORIENINJAS_API_KEY not found in .env")
        return None

    try:
        response = requests.get(
            API_URL + query,
            headers={'X-Api-Key': CALORIENINJAS_API_KEY}
        )
        
        if response.status_code == requests.codes.ok:
            data = response.json()
            if data['items']:
                # Sum up all items if multiple matches found for the query
                item = data['items'][0] # Take the best match for now
                return {
                    "name": item['name'],
                    "calories": item['calories'],
                    "protein": item['protein_g'],
                    "carbs": item['carbohydrates_total_g'],
                    "fats": item['fat_total_g'],
                    "unit": "g"
                }
        else:
            print(f"CalorieNinjas API Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Error calling CalorieNinjas: {e}")
        
    return None

import os
import cv2
import numpy as np
from ultralytics import YOLO
import torch
from App.core.ai.food_database import get_nutritional_info
from App.core.ai.nutrition_api import get_nutrition_data

class FoodDetector:
    def __init__(self, model_path=None):
        # Path to the user's best.pt
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 'models', 'best.pt')
        
        self.model_path = model_path
        self.model = None
        self.model_loaded = False # Track status

    def _load_model(self):
        """Internal method to load the YOLO model."""
        if self.model_loaded:
            return

        try:
            if os.path.exists(self.model_path):
                print(f"Loading custom model from {self.model_path}...")
                self.model = YOLO(self.model_path)
            else:
                fallback_path = os.path.join(os.path.dirname(__file__), 'models', 'yolov8n.pt')
                self.model = YOLO(fallback_path) 
            self.model_loaded = True
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None

    def detect(self, image_path):
        """
        Runs inference on an image and returns a list of detected food objects.
        Now loads the model lazily if not already present.
        """
        # Load model on FIRST use
        if not self.model_loaded:
            self._load_model()

        if self.model is None:
            print("AI Error: Model could not be loaded.")
            return []

        try:
            print(f"AI: Scanning image {image_path}...")
            results = self.model(image_path)
            detections = []
            
            # Process results
            for result in results:
                boxes = result.boxes
                print(f"AI: Found {len(boxes)} raw detections.")
                for box in boxes:
                    # Confidence score
                    conf = float(box.conf[0])
                    if conf < 0.15: # Lowered sensitivity threshold
                        print(f"AI: Skipping detection with low confidence {conf:.2f}")
                        continue
                        
                    # Class ID and Name
                    cls_id = int(box.cls[0])
                    name = self.model.names[cls_id]
                    print(f"AI: Detected {name} ({conf:.2f})")
                    
                    # Fetch nutritional info for this label
                    # Try Real API first
                    nutrients = get_nutrition_data(name)
                    
                    # Fallback to local mock data if API fails or item not found
                    if not nutrients:
                        print(f"AI: API did not find {name}, falling back to local DB.")
                        nutrients = get_nutritional_info(name)
                    
                    detections.append({
                        "name": nutrients.get("name", name),
                        "confidence": conf,
                        "calories": nutrients["calories"],
                        "protein": nutrients["protein"],
                        "carbs": nutrients["carbs"],
                        "fats": nutrients["fats"],
                        "unit": nutrients["unit"]
                    })
            
            print(f"AI: Final detection count: {len(detections)}")        
            return detections
        except Exception as e:
            print(f"AI Inference error: {e}")
            return []

# Singleton instance
_detector = None

def get_detector():
    global _detector
    if _detector is None:
        _detector = FoodDetector()
    return _detector

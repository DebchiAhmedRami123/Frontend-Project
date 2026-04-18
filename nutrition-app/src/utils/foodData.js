export const commonFoods = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Grilled Chicken', calories: 190, protein: 30, carbs: 0, fats: 7 },
  { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fats: 13 },
  { name: 'Lean Beef', calories: 250, protein: 26, carbs: 0, fats: 15 },
  { name: 'Hard Boiled Egg', calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 24, fats: 0.9 },
  { name: 'Pasta (Cooked)', calories: 131, protein: 5, carbs: 25, fats: 1.1 },
  { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21, fats: 1.9 },
  { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fats: 1.4 },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
  { name: 'Boiled Potato', calories: 77, protein: 2, carbs: 17, fats: 0.1 },
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15 },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50 },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50 },
  { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
  { name: 'Milk (Full)', calories: 64, protein: 3.3, carbs: 4.8, fats: 3.6 },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100 },
  { name: 'French Fries', calories: 312, protein: 3.4, carbs: 41, fats: 15 },
  { name: 'Pizza (Slice)', calories: 285, protein: 12, carbs: 36, fats: 10 },
  { name: 'Hamburger', calories: 295, protein: 17, carbs: 24, fats: 14 },
];

export const calculateMacros = (food, portionGrams) => {
  const factor = portionGrams / 100;
  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor),
    carbs: Math.round(food.carbs * factor),
    fats: Math.round(food.fats * factor),
  };
};

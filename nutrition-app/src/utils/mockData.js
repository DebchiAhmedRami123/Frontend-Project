// src/utils/mockData.js
// [MOCK] — Replace with real API calls in Phase 3

export const mockUser = {
  id: 1,
  email: 'rami@test.com',
  role: 'client',
  has_profile: true,
}

export const mockProfile = {
  full_name: 'Rami',
  age: 22,
  sex: 'male',
  weight_kg: 78,
  height_cm: 178,
  goal: 'lose',
  activity_level: 'moderate',
  diet_preference: 'halal',
  daily_cal_goal: 2100,
  bmr: 1820,
  tdee: 2600,
}

export const mockDailyStats = {
  date: '2026-04-02',
  total_calories: 1450,
  total_protein: 95,
  total_carbs: 142,
  total_fat: 45,
  cal_goal: 2100,
  cal_remaining: 650,
  percent_reached: 69.0,
  meals: [
    {
      id: 1,
      meal_type: 'breakfast',
      logged_at: '2026-04-02T07:30:00',
      items: [
        { id: 1, name: 'Oats', portion_g: 80, calories: 304, protein: 11, carbs: 52, fat: 5 },
        { id: 2, name: 'Banana', portion_g: 120, calories: 107, protein: 1.3, carbs: 27, fat: 0.4 },
      ],
    },
    {
      id: 2,
      meal_type: 'lunch',
      logged_at: '2026-04-02T13:00:00',
      items: [
        { id: 3, name: 'Grilled Chicken', portion_g: 150, calories: 247, protein: 46, carbs: 0, fat: 5 },
        { id: 4, name: 'Brown Rice', portion_g: 200, calories: 218, protein: 4.5, carbs: 45, fat: 1.6 },
      ],
    },
  ],
}

export const mockWeeklyStats = {
  week_start: '2026-03-27',
  days: [
    { date: '2026-03-27', day: 'Thu', total_calories: 1800, cal_goal: 2100 },
    { date: '2026-03-28', day: 'Fri', total_calories: 2250, cal_goal: 2100 },
    { date: '2026-03-29', day: 'Sat', total_calories: 1650, cal_goal: 2100 },
    { date: '2026-03-30', day: 'Sun', total_calories: 1950, cal_goal: 2100 },
    { date: '2026-03-31', day: 'Mon', total_calories: 1400, cal_goal: 2100 },
    { date: '2026-04-01', day: 'Tue', total_calories: 2100, cal_goal: 2100 },
    { date: '2026-04-02', day: 'Wed', total_calories: 1450, cal_goal: 2100 },
  ],
  avg_calories: 1800,
  weekly_deficit: 2100,
  avg_protein: 95,
  avg_carbs: 142,
  avg_fat: 45,
}

export const mockAIDetection = {
  ai_available: true,
  image_url: null,
  detections: [
    {
      food_name: 'grilled_chicken',
      display_name: 'Grilled Chicken',
      confidence: 0.91,
      portion_g: 150,
      calories: 247,
      protein: 46,
      carbs: 0,
      fat: 5.4,
      calories_per_100g: 165,
      protein_per_100g: 31,
      carbs_per_100g: 0,
      fat_per_100g: 3.6,
      food_item_id: 23,
    },
    {
      food_name: 'white_rice',
      display_name: 'White Rice',
      confidence: 0.87,
      portion_g: 200,
      calories: 260,
      protein: 4.4,
      carbs: 57,
      fat: 0.4,
      calories_per_100g: 130,
      protein_per_100g: 2.2,
      carbs_per_100g: 28.5,
      fat_per_100g: 0.2,
      food_item_id: 7,
    },
  ],
}

export const mockFoodSearch = [
  { id: 1, name: 'Chicken Breast', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6 },
  { id: 2, name: 'Brown Rice', calories_per_100g: 123, protein_per_100g: 2.7, carbs_per_100g: 26, fat_per_100g: 0.9 },
  { id: 3, name: 'Banana', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3 },
  { id: 4, name: 'Oats', calories_per_100g: 389, protein_per_100g: 16.9, carbs_per_100g: 66.3, fat_per_100g: 6.9 },
  { id: 5, name: 'Egg (whole)', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11 },
  { id: 6, name: 'Salmon', calories_per_100g: 208, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 13 },
  { id: 7, name: 'White Rice', calories_per_100g: 130, protein_per_100g: 2.2, carbs_per_100g: 28.5, fat_per_100g: 0.2 },
  { id: 8, name: 'Greek Yogurt', calories_per_100g: 59, protein_per_100g: 10, carbs_per_100g: 3.6, fat_per_100g: 0.7 },
  { id: 9, name: 'Avocado', calories_per_100g: 160, protein_per_100g: 2, carbs_per_100g: 8.5, fat_per_100g: 14.7 },
  { id: 10, name: 'Sweet Potato', calories_per_100g: 86, protein_per_100g: 1.6, carbs_per_100g: 20, fat_per_100g: 0.1 },
]

export const mockConsultations = [
  { id: 1, scheduled_at: '2026-04-10T10:00:00', status: 'confirmed', zoom_link: 'https://zoom.us/j/123', nutritionist_name: 'Dr. Jane Doe' },
  { id: 2, scheduled_at: '2026-04-15T14:00:00', status: 'pending', zoom_link: null, nutritionist_name: 'Dr. Jane Doe' },
  { id: 3, scheduled_at: '2026-03-20T09:00:00', status: 'done', zoom_link: null, nutritionist_name: 'Dr. Jane Doe' },
]

export const mockAdminStats = {
  total_users: 142,
  total_meals_logged: 3847,
  consultations_this_week: 23,
}

export const mockAdminUsers = [
  { id: 1, email: 'rami@test.com', role: 'client', created_at: '2026-01-15' },
  { id: 2, email: 'jane@nutritrack.com', role: 'nutritionist', created_at: '2026-01-10' },
  { id: 3, email: 'admin@nutritrack.com', role: 'admin', created_at: '2026-01-01' },
  { id: 4, email: 'sarah@test.com', role: 'client', created_at: '2026-02-20' },
  { id: 5, email: 'bob@test.com', role: 'client', created_at: '2026-03-05' },
]

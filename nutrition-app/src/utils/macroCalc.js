// src/utils/macroCalc.js

/**
 * Mifflin-St Jeor BMR formula
 * @param {{ weight_kg: number, height_cm: number, age: number, sex: 'male'|'female' }} params
 * @returns {number} BMR in kcal
 */
export function calcBMR({ weight_kg, height_cm, age, sex }) {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

/**
 * Total Daily Energy Expenditure
 */
export function calcTDEE(bmr, activity_level) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity_level] || 1.55))
}

/**
 * Daily calorie goal based on weight goal
 */
export function calcDailyGoal(tdee, goal) {
  if (goal === 'lose') return tdee - 500
  if (goal === 'gain') return tdee + 300
  return tdee // maintain
}

/**
 * Macro targets from daily calorie goal
 * Default split: 30% protein, 40% carbs, 30% fat
 */
export function calcMacroTargets(daily_cal_goal) {
  return {
    protein_g: Math.round((daily_cal_goal * 0.30) / 4),
    carbs_g: Math.round((daily_cal_goal * 0.40) / 4),
    fat_g: Math.round((daily_cal_goal * 0.30) / 9),
  }
}

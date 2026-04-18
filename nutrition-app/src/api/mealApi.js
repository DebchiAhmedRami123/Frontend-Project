import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardStats = async (date = null) => {
  const params = date ? { params: { date } } : {};
  const res = await axiosInstance.get('/meals/dashboard', params);
  return res.data;
};

export const getTodayMeals = async (date = null) => {
  const params = date ? { params: { date } } : {};
  const res = await axiosInstance.get('/meals/today', params);
  return res.data;
};

export const getMealDetails = async (mealId) => {
  const res = await axiosInstance.get(`/meals/${mealId}`);
  return res.data;
};

export const updateMeal = async (mealId, mealData) => {
  const res = await axiosInstance.put(`/meals/${mealId}`, mealData);
  return res.data;
};

export const deleteMeal = async (mealId) => {
  const res = await axiosInstance.delete(`/meals/${mealId}`);
  return res.data;
};

export const logMeal = async (mealData) => {
  const res = await axiosInstance.post('/meals/', mealData);
  return res.data;
};

export const clearHistory = async () => {
  const res = await axiosInstance.delete('/meals/history');
  return res.data;
};

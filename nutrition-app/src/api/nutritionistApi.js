import axiosInstance from './axiosInstance';

export const getNutritionists = async (params = {}) => {
  const response = await axiosInstance.get('/auth/nutritionists', { params });
  return response.data;
};

export const getNutritionistById = async (id) => {
  const response = await axiosInstance.get(`/auth/nutritionists/${id}`);
  return response.data;
};

export const submitNutritionistProfile = async (profileData) => {
  const response = await axiosInstance.post('/auth/nutritionist-profile', profileData);
  return response.data;
};

export const applyAsNutritionist = async () => {
  const response = await axiosInstance.post('/auth/apply-as-nutritionist');
  return response.data;
};

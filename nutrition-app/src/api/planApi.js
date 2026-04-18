import axiosInstance from './axiosInstance';

export const createPlan = async (planData) => {
  const response = await axiosInstance.post('/plans/', planData);
  return response.data;
};

export const updatePlan = async (planId, planData) => {
  const response = await axiosInstance.put(`/plans/${planId}`, planData);
  return response.data;
};

export const deletePlan = async (planId) => {
  const response = await axiosInstance.delete(`/plans/${planId}`);
  return response.data;
};

export const getMyPlans = async () => {
  const response = await axiosInstance.get('/plans/my');
  return response.data.plans;
};

export const getNutritionistPlans = async (nutritionistId) => {
  const response = await axiosInstance.get(`/plans/nutritionists/${nutritionistId}`);
  return response.data.plans;
};

export const getPlanDetails = async (planId) => {
  const response = await axiosInstance.get(`/plans/${planId}`);
  return response.data.plan;
};

import axiosInstance from './axiosInstance';

/**
 * Subscription API Service
 * POST /subscriptions/         → Create subscription (purchase)
 * GET  /subscriptions/my       → Client's subscriptions
 * GET  /subscriptions/clients  → Nutritionist's clients
 * GET  /subscriptions/stats    → Nutritionist dashboard stats
 */

export const createSubscription = async (data) => {
  const res = await axiosInstance.post('/subscriptions/', data);
  return res.data;
};

export const getMySubscriptions = async (status = '') => {
  const params = status ? { status } : {};
  const res = await axiosInstance.get('/subscriptions/my', { params });
  return res.data;
};

export const getMyClients = async (status = 'active') => {
  const res = await axiosInstance.get('/subscriptions/clients', { params: { status } });
  return res.data;
};

export const getClientMeals = async (clientId) => {
  const res = await axiosInstance.get(`/subscriptions/clients/${clientId}/meals`);
  return res.data;
};

export const getNutritionistStats = async () => {
  const res = await axiosInstance.get('/subscriptions/stats');
  return res.data;
};

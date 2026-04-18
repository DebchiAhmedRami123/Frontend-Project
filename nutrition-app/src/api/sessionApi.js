import axiosInstance from './axiosInstance';

/**
 * Session / Booking API Service
 */

export const bookSession = async (data) => {
  const res = await axiosInstance.post('/sessions/', data);
  return res.data;
};

export const getUpcomingSessions = async () => {
  const res = await axiosInstance.get('/sessions/upcoming');
  return res.data;
};

export const getSessionHistory = async () => {
  const res = await axiosInstance.get('/sessions/history');
  return res.data;
};

export const completeSession = async (sessionId, notes = '') => {
  const res = await axiosInstance.put(`/sessions/${sessionId}/complete`, { notes });
  return res.data;
};

export const cancelSession = async (sessionId) => {
  const res = await axiosInstance.put(`/sessions/${sessionId}/cancel`);
  return res.data;
};

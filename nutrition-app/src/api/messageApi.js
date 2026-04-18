import axiosInstance from './axiosInstance';

/**
 * Message API Service
 */

export const sendMessage = async (data) => {
  const res = await axiosInstance.post('/messages/', data);
  return res.data;
};

export const getConversations = async () => {
  const res = await axiosInstance.get('/messages/');
  return res.data;
};

export const getThread = async (partnerId) => {
  const res = await axiosInstance.get(`/messages/thread/${partnerId}`);
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await axiosInstance.get('/messages/unread-count');
  return res.data;
};

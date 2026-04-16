import axiosInstance from './axiosInstance';

export const listUsers = async (userType = null, status = null) => {
  const params = {};
  if (userType) params.user_type = userType;
  if (status) params.status = status;
  const res = await axiosInstance.get('/admin/users', { params });
  return res.data;
};

export const getUser = async (id) => {
  const res = await axiosInstance.get(`/admin/users/${id}`);
  return res.data;
};

export const changeUserStatus = async (id, status, reason = '') => {
  const res = await axiosInstance.put(`/admin/users/${id}/status`, { status, reason });
  return res.data;
};

export const listAdmins = async () => {
  const res = await axiosInstance.get('/admin/users/admins');
  return res.data;
};

export const createAdmin = async (data) => {
  const res = await axiosInstance.post('/admin/users/admins', data);
  return res.data;
};

export const updateAdminPermissions = async (id, permissions) => {
  const res = await axiosInstance.post(`/admin/users/admins/${id}/permissions`, { permissions });
  return res.data;
};

export const deleteAdmin = async (id) => {
  const res = await axiosInstance.delete(`/admin/users/admins/${id}`);
  return res.data;
};

export const approveNutritionist = async (id) => {
  const res = await axiosInstance.put(`/admin/users/nutritionists/${id}/status`);
  return res.data;
};

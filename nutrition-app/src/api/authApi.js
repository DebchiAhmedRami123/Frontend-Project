import axiosInstance from './axiosInstance';

const BASE = '/auth';

export const signUp = async (userData) => {
  const res = await axiosInstance.post(`${BASE}/sign-up`, userData);
  return res.data;
};

export const loginEmail = async (email) => {
  const res = await axiosInstance.post(`${BASE}/login`, { email });
  return res.data;
};

export const loginPassword = async (password) => {
  const res = await axiosInstance.post(
    `${BASE}/login-completion`,
    { password },
    { withCredentials: true }
  );
  if (res.data.access_token) {
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
  }
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.delete(`${BASE}/logout`);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axiosInstance.delete(`${BASE}/delete`);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return res.data;
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  const res = await axiosInstance.post(
    `${BASE}/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refresh_token}` } }
  );
  if (res.data.access_token) {
    localStorage.setItem('access_token', res.data.access_token);
  }
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosInstance.get(`${BASE}/profile`);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axiosInstance.post(
    `${BASE}/forgot-password`,
    { email },
    { withCredentials: true }
  );
  return res.data;
};

export const resetPassword = async (token, password, confirm_password) => {
  const res = await axiosInstance.post(`${BASE}/reset-password`, {
    token,
    password,
    confirm_password,
  });
  return res.data;
};

// Automatically handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await refreshToken();
        original.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
        return axiosInstance(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
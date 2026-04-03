import axiosInstance from './axiosInstance';

const BASE = '/auth';

// ── Temp token storage (shared between login steps) ────────────────────────────
let _tempToken = null;

export const getTempToken = () => _tempToken;
export const clearTempToken = () => { _tempToken = null; };

// ── Sign Up ────────────────────────────────────────────────────────────────────

export const signUp = async (userData) => {
  const res = await axiosInstance.post(`${BASE}/sign-up`, userData);
  if (res.data.access_token) {
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
  }
  return res.data;
};

// ── Login Step 1 — email check ─────────────────────────────────────────────────

export const loginEmail = async (email) => {
  const res = await axiosInstance.post(`${BASE}/login`, { email });
  // Store the temp_token for the password step
  if (res.data.temp_token) {
    _tempToken = res.data.temp_token;
  }
  return res.data;
};

// ── Login Step 2 — password verification ───────────────────────────────────────

export const loginPassword = async (password) => {
  const res = await axiosInstance.post(
    `${BASE}/login-completion`,
    { password, temp_token: _tempToken },
    { withCredentials: true }
  );
  if (res.data.access_token) {
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
  }
  // Clean up temp token after successful login
  _tempToken = null;
  return res.data;
};

// ── Logout ─────────────────────────────────────────────────────────────────────

export const logout = async () => {
  const res = await axiosInstance.delete(`${BASE}/logout`);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  return res.data;
};

// ── Delete Account ─────────────────────────────────────────────────────────────

export const deleteAccount = async () => {
  const res = await axiosInstance.delete(`${BASE}/delete`);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  return res.data;
};

// ── Refresh Token ──────────────────────────────────────────────────────────────

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

// ── Profile ────────────────────────────────────────────────────────────────────

export const getProfile = async () => {
  const res = await axiosInstance.get(`${BASE}/profile`);
  return res.data;
};

// ── Forgot Password ────────────────────────────────────────────────────────────

export const forgotPassword = async (email) => {
  const res = await axiosInstance.post(
    `${BASE}/forgot-password`,
    { email },
    { withCredentials: true }
  );
  return res.data;
};

// ── Reset Password ─────────────────────────────────────────────────────────────

export const resetPassword = async (token, password, confirm_password) => {
  const res = await axiosInstance.post(`${BASE}/reset-password`, {
    token,
    password,
    confirm_password,
  });
  return res.data;
};

// ── Axios interceptor: auto-refresh expired tokens ─────────────────────────────

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
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
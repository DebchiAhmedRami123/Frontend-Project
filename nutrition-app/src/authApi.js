import axios from "axios";

const BASE_URL = "http://localhost:5000/auth";

// ── attach token to every request automatically ──PP
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// ─── 1. SIGN UP ───────────────────────────────────────────────────────────────
// POST /auth/sign-up
// Body: { first_name, last_name, email, password, phone? }
export const signUp = async (userData) => {
  const response = await axios.post(`${BASE_URL}/sign-up`, userData);
  return response.data;
};

// ─── 2. LOGIN — STEP 1 (email check) ─────────────────────────────────────────
// POST /auth/login
// Body: { email }
export const loginEmail = async (email) => {
  const response = await axios.post(`${BASE_URL}/login`, { email });
  return response.data;
};


// ─── 3. LOGIN — STEP 2 (password + token generation) ─────────────────────────
// POST /auth/login-completion
// Body: { password }
// Requires: session cookie (set automatically by browser after step 1)
export const loginPassword = async (password) => {
  const response = await axios.post(
    `${BASE_URL}/login-completion`,
    { password },
    { withCredentials: true }  // ← required to send Flask session cookie
  );
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
  }
  return response.data;
};


// ─── 4. LOGOUT ────────────────────────────────────────────────────────────────
// DELETE /auth/logout
// Requires: Bearer access_token
export const logout = async () => {
  const response = await axios.delete(`${BASE_URL}/logout`);
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return response.data;
};


// ─── 5. DELETE ACCOUNT ────────────────────────────────────────────────────────
// DELETE /auth/delete
// Requires: Bearer access_token
export const deleteAccount = async () => {
  const response = await axios.delete(`${BASE_URL}/delete`);
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return response.data;
};


// ─── 6. REFRESH ACCESS TOKEN ─────────────────────────────────────────────────
// POST /auth/refresh
// Requires: Bearer refresh_token (not the access token)
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  const response = await axios.post(
    `${BASE_URL}/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refresh_token}` } }  // ← use refresh token here
  );
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }
  return response.data;
};


// ─── 7. GET PROFILE ───────────────────────────────────────────────────────────
// GET /auth/profile
// Requires: Bearer access_token
export const getProfile = async () => {
  const response = await axios.get(`${BASE_URL}/profile`);
  return response.data;
};


// ─── 8. FORGOT PASSWORD (send reset email) ────────────────────────────────────
// POST /auth/forgot-password
// Body: { email }
// Requires: session cookie (user must have completed login step 1)
export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${BASE_URL}/forgot-password`,
    { email },
    { withCredentials: true }  // ← required for session
  );
  return response.data;
};


// ─── 9. RESET PASSWORD (submit new password) ──────────────────────────────────
// POST /auth/reset-password
// Body: { token, password, confirm_password }
// token comes from the URL query param ?token=xxx when user clicks email link
export const resetPassword = async (token, password, confirm_password) => {
  const response = await axios.post(`${BASE_URL}/reset-password`, {
    token,
    password,
    confirm_password,
  });
  return response.data;
};


// ─── AUTO REFRESH INTERCEPTOR ────────────────────────────────────────────────
// automatically retries a failed request after refreshing the access token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // access token expired → try to refresh silently
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await refreshToken();
        original.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
        return axios(original);
      } catch {
        // refresh token also expired → force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
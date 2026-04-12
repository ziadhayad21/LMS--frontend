import axios from "axios";

// By default, we use an empty string as API_URL so it relative (e.g. /api/v1)
// This leverages the Next.js rewrites defined in next.config.js to avoid cross-domain cookie issues.
const API_URL = typeof window !== 'undefined' ? '' : (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://lms-backend-production-3598.up.railway.app");

const api = axios.create({
  baseURL: API_URL + "/api/v1",
  withCredentials: true,
});

// Response Interceptor to unwrap data and handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out.' : undefined) ||
      (error.message === 'Network Error' ? 'Network error. Please check your connection and CORS settings.' : undefined) ||
      error.message ||
      'An unexpected error occurred.';
    
    const statusCode = error.response?.status;

    // Redirect to login on 401 (client-side only)
    if (statusCode === 401 && typeof window !== 'undefined') {
      const isLoginPage = window.location.pathname.startsWith('/login');
      if (!isLoginPage) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ message, statusCode, originalError: error });
  }
);

export default api;

import axios from "axios";

/**
 * Centralized Axios instance for API communication.
 * Primary: VITE_API_URL (as requested)
 * Secondary: NEXT_PUBLIC_API_URL (Next.js standard)
 */
// The frontend must NEVER call its own domain for API
// Strict enforcement of the absolute Railway backend URL
const API_URL = (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://lms-backend-production-3598.up.railway.app').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const api = axios.create({
  // Force strict absolute URL + trailing slash
  baseURL: `${API_URL}/api/v1/`,
  withCredentials: true,
});

// Response Interceptor to unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 404) {
      console.error('API endpoint not found. Check if /api/v1 is correctly prefixed.');
    }
    return Promise.reject(error);
  }
);

export default api;

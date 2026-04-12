import axios from "axios";

/**
 * Centralized Axios instance for API communication.
 * Primary: VITE_API_URL (as requested)
 * Secondary: NEXT_PUBLIC_API_URL (Next.js standard)
 */
const api = axios.create({
  // Using the exact pattern requested by the user
  // Adding the /api/v1 suffix as specified
  baseURL: (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://lms-backend-production-3598.up.railway.app') + "/api/v1",
  withCredentials: true,
});

// Response Interceptor to unwrap data (to maintain compatibility with existing project lib)
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;

import axios from "axios";

/**
 * Centralized Axios instance for API communication.
 * Primary: VITE_API_URL (as requested)
 * Secondary: NEXT_PUBLIC_API_URL (Next.js standard)
 */
// We now use relative paths on the CLIENT so Next.js Rewrites can proxy the request to the Railway backend
// This solves ALL CORS and Cross-Domain Cookie (jwt) SameSite issues!
// However, on the SERVER (Next.js SSR), relative paths fail because Node has no 'origin'. We must hit the backend directly.
const IS_SERVER = typeof window === 'undefined';
const API_URL = IS_SERVER 
  ? (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://lms-backend-production-3598.up.railway.app').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
  : '';

const api = axios.create({
  // Setting the baseURL to relative prefix handled by Next.js rewrites on client
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

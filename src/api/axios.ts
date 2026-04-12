import axios from 'axios';

/**
 * Centralized Axios instance for API communication.
 * Uses NEXT_PUBLIC_API_URL environment variable.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor to unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// For Vite compatibility if requested, though this is a Next.js project
// @ts-ignore
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
  // @ts-ignore
  api.defaults.baseURL = import.meta.env.VITE_API_URL;
}

export default api;

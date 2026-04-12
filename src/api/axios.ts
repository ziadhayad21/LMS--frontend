import axios from "axios";

const API_URL = process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://lms-backend-production-3598.up.railway.app";

const api = axios.create({
  baseURL: API_URL + "/api/v1",
  withCredentials: true,
});

// Response Interceptor to unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

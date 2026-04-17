import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import api from '@/src/api/axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000; // Large video uploads can take several minutes

/** Client whose response interceptor returns `response.data` (unwrapped). */
export type ApiClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
  interceptors: ReturnType<typeof axios.create>['interceptors'];
};

const rawClient = api;

// Note: No additional response interceptor here to avoid double-unwrapping of response.data
// Errors are still handled by the underlying api instance or can be added as a separate layer if needed.

export const apiClient = rawClient as unknown as ApiClient;

// ─── Multipart Helper ────────────────────────────────────────────────────────
export const apiUpload = <T = unknown>(
  url: string,
  formData: FormData,
  method: 'post' | 'patch' = 'post'
) =>
  apiClient.request<T>({
    method,
    url,
    data: formData,
    timeout: UPLOAD_TIMEOUT_MS,
  });

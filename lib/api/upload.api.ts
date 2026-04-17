import { apiClient } from './client';
import type { ApiSuccess } from '@/types';

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    // `apiClient` is built on an axios instance that already unwraps `response.data`,
    // so this call returns the API payload directly (not { data: ... }).
    const res = await apiClient.post<ApiSuccess<{ url: string }>>('/upload/image', formData);
    return res.data;
  },

  uploadVideo: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('video', file);

    const res = await apiClient.post<ApiSuccess<{ url: string }>>('/upload/video', formData);
    return res.data;
  },
};

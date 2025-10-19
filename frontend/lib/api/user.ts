import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  totalCertificates: number;
  achievements: string[];
  createdAt: string;
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  avatar?: File;
}

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    const response = await apiClient.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

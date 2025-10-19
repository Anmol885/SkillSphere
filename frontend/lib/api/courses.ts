import { apiClient } from './client';

export interface Course {
  id: string;
  title: string;  // Backend uses 'title' not 'name'
  platform: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  category: string;
  certificateUrl?: string;
  progress: number;
  hoursLearned?: number;
}

export interface CreateCourseData {
  name: string;
  platform: string;
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  certificate?: File;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  id: string;
}

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  getById: async (id: string): Promise<Course> => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  create: async (data: CreateCourseData): Promise<Course> => {
    const formData = new FormData();
    // Map frontend field names to backend field names
    formData.append('title', data.name); // Map 'name' to 'title'
    formData.append('platform', data.platform);
    formData.append('category', data.category);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('status', data.status);
    if (data.certificate) {
      formData.append('certificate', data.certificate);
    }
    const response = await apiClient.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (data: UpdateCourseData): Promise<Course> => {
    const { id, ...updateData } = data;
    const formData = new FormData();
    // Map frontend field names to backend field names
    if (updateData.name) formData.append('title', updateData.name);
    if (updateData.platform) formData.append('platform', updateData.platform);
    if (updateData.category) formData.append('category', updateData.category);
    if (updateData.startDate) formData.append('startDate', updateData.startDate);
    if (updateData.endDate) formData.append('endDate', updateData.endDate);
    if (updateData.status) formData.append('status', updateData.status);
    if (updateData.certificate) formData.append('certificate', updateData.certificate);
    const response = await apiClient.put(`/courses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },

  markCompleted: async (id: string): Promise<Course> => {
    const response = await apiClient.patch(`/courses/${id}/complete`);
    return response.data;
  },
};

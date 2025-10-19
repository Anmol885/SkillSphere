import { apiClient } from './client';

export interface MonthlyStats {
  month: string;
  hours: number;
  coursesCompleted: number;
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
  totalCertificates: number;
  totalHoursLearned: number;
}

export interface AnalyticsData {
  monthlyStats: MonthlyStats[];
  categoryDistribution: CategoryStats[];
  dashboardStats: DashboardStats;
}

export const analyticsApi = {
  getAll: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get('/analytics');
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },
};

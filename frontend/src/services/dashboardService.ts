import api from './api';
import { EmployeeDashboardData, AdminDashboardData } from '../types/dashboard';

export const dashboardService = {
  getEmployeeDashboard: async (): Promise<{ success: boolean; data: EmployeeDashboardData }> => {
    const res = await api.get('/dashboard/employee');
    return res.data;
  },

  getAdminDashboard: async (): Promise<{ success: boolean; data: AdminDashboardData }> => {
    const res = await api.get('/dashboard/admin');
    return res.data;
  },
};

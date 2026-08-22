import api from './api';
import { Employee } from '../types/employee';

export const employeeService = {
  getEmployees: async (params?: { page?: number; limit?: number; search?: string; department?: string }) => {
    const res = await api.get('/employees', { params });
    return res.data;
  },

  getEmployeeById: async (id: string) => {
    const res = await api.get(`/employees/${id}`);
    return res.data;
  },

  createEmployee: async (data: Partial<Employee>) => {
    const res = await api.post('/employees', data);
    return res.data;
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    const res = await api.put(`/employees/${id}`, data);
    return res.data;
  },

  updateOwnProfile: async (id: string, data: { phone?: string; address?: string }) => {
    const res = await api.patch(`/employees/${id}/profile`, data);
    return res.data;
  },

  deleteEmployee: async (id: string) => {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
  },

  uploadProfilePicture: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const res = await api.post(`/employees/${id}/profile-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

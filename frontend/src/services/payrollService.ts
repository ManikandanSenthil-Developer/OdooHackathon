import api from './api';

export const payrollService = {
  getMySalary: async () => {
    const res = await api.get('/payroll/my');
    return res.data;
  },

  getAllPayrolls: async (params?: { department?: string; search?: string }) => {
    const res = await api.get('/admin/payroll', { params });
    return res.data;
  },

  updateSalaryStructure: async (employeeId: string, data: any) => {
    const res = await api.put(`/admin/payroll/${employeeId}`, data);
    return res.data;
  },
};

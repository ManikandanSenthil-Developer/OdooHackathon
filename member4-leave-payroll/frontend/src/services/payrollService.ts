import { api } from './api';
import { PayrollRecord, UpdateSalaryPayload } from '../types/payroll';

export const payrollService = {
  getMySalary: async (): Promise<PayrollRecord> => {
    const res = await api.get('/payroll/my');
    return res.data.data;
  },

  getAllPayrolls: async (params?: { search?: string; department?: string }): Promise<PayrollRecord[]> => {
    const res = await api.get('/admin/payroll', { params });
    return res.data.data;
  },

  getPayrollByEmployeeId: async (employeeId: string): Promise<PayrollRecord> => {
    const res = await api.get(`/admin/payroll/${employeeId}`);
    return res.data.data;
  },

  updateSalary: async (employeeId: string, payload: UpdateSalaryPayload): Promise<PayrollRecord> => {
    const res = await api.put(`/admin/payroll/${employeeId}`, payload);
    return res.data.data;
  },
};

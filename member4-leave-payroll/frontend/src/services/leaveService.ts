import { api } from './api';
import { CreateLeavePayload, LeaveBalanceSummary, LeaveRequest, ReviewLeavePayload } from '../types/leave';

export const leaveService = {
  getBalance: async (): Promise<LeaveBalanceSummary> => {
    const res = await api.get('/leave/balance');
    return res.data.data;
  },

  getMyLeaves: async (): Promise<LeaveRequest[]> => {
    const res = await api.get('/leave/my');
    return res.data.data;
  },

  applyLeave: async (payload: CreateLeavePayload): Promise<LeaveRequest> => {
    const res = await api.post('/leave', payload);
    return res.data.data;
  },

  getLeaveById: async (id: string): Promise<LeaveRequest> => {
    const res = await api.get(`/leave/${id}`);
    return res.data.data;
  },

  getAdminLeaves: async (params?: { search?: string; status?: string; leave_type?: string }): Promise<LeaveRequest[]> => {
    const res = await api.get('/admin/leave', { params });
    return res.data.data;
  },

  getAdminHistory: async (): Promise<LeaveRequest[]> => {
    const res = await api.get('/admin/leave/history');
    return res.data.data;
  },

  approveLeave: async (id: string, payload?: ReviewLeavePayload): Promise<LeaveRequest> => {
    const res = await api.put(`/admin/leave/${id}/approve`, payload || {});
    return res.data.data;
  },

  rejectLeave: async (id: string, payload?: ReviewLeavePayload): Promise<LeaveRequest> => {
    const res = await api.put(`/admin/leave/${id}/reject`, payload || {});
    return res.data.data;
  },
};

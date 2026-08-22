import api from './api';
import { LeaveType } from '../types/leave';

export const leaveService = {
  getMyBalance: async () => {
    const res = await api.get('/leave/balance');
    return res.data;
  },

  getMyLeaves: async () => {
    const res = await api.get('/leave/my');
    return res.data;
  },

  applyLeave: async (data: { leave_type: LeaveType; start_date: string; end_date: string; remarks?: string }) => {
    const res = await api.post('/leave', data);
    return res.data;
  },

  getAdminLeaves: async (params?: { status?: string; leave_type?: string; search?: string }) => {
    const res = await api.get('/admin/leave', { params });
    return res.data;
  },

  approveLeave: async (id: string, comment?: string) => {
    const res = await api.put(`/admin/leave/${id}/approve`, { admin_comment: comment });
    return res.data;
  },

  rejectLeave: async (id: string, comment?: string) => {
    const res = await api.put(`/admin/leave/${id}/reject`, { admin_comment: comment });
    return res.data;
  },
};

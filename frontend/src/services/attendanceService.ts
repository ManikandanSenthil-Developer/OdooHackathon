import api from './api';

export const attendanceService = {
  checkIn: async () => {
    const res = await api.post('/attendance/check-in');
    return res.data;
  },

  checkOut: async () => {
    const res = await api.post('/attendance/check-out');
    return res.data;
  },

  getToday: async () => {
    const res = await api.get('/attendance/today');
    return res.data;
  },

  getWeek: async () => {
    const res = await api.get('/attendance/week');
    return res.data;
  },

  getAll: async (params?: { date?: string; employeeId?: string }) => {
    const res = await api.get('/attendance/all', { params });
    return res.data;
  },
};

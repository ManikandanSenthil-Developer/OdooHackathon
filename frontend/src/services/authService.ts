import api from './api';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  signup: async (userData: { name: string; email: string; password: string; role?: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

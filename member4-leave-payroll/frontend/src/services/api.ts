import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dayflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const currentRole = localStorage.getItem('dayflow_dev_role') || 'EMPLOYEE';
  config.headers['x-mock-role'] = currentRole;
  config.headers['x-mock-employee-id'] = currentRole === 'ADMIN' ? 'EMP-ADMIN' : 'EMP-001';
  config.headers['x-mock-name'] = currentRole === 'ADMIN' ? 'Alex Rivera (HR Lead)' : 'Sarah Connor';
  config.headers['x-mock-email'] = currentRole === 'ADMIN' ? 'admin@dayflow.com' : 'sarah@dayflow.com';

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API] Unauthorized access or expired token.');
    }
    return Promise.reject(error);
  }
);

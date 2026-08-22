import axios from 'axios';

// Resolve API base URL from environment or default to /api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach auth tokens if available from Member 1
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dayflow_token') || sessionStorage.getItem('dayflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Mock RBAC integration
    try {
      const savedAuth = localStorage.getItem('dayflow_auth_session');
      if (savedAuth) {
        const user = JSON.parse(savedAuth);
        if (user.employeeId) config.headers['x-mock-employee-id'] = user.employeeId;
        if (user.role) config.headers['x-mock-role'] = user.role;
      }
    } catch (e) {
      console.warn('Could not parse mock auth session');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is not available (Network Error or 404 in dev preview), allow client fallback
    return Promise.reject(error);
  }
);

export default apiClient;

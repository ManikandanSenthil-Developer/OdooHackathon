import api from './api';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALFDAY' | 'LEAVE';

export interface AttendanceRecord {
  id: number;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  workingHours: number;
  employee?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AttendanceResponse {
  success: boolean;
  data: AttendanceRecord | null;
  message?: string;
}

export interface AttendanceListResponse {
  success: boolean;
  data: AttendanceRecord[];
  message?: string;
}

// The shared Axios client attaches the existing JWT Authorization header.
export const attendanceApi = {
  checkIn: async (): Promise<AttendanceResponse> => {
    const response = await api.post<AttendanceResponse>('/attendance/check-in');
    return response.data;
  },

  checkOut: async (): Promise<AttendanceResponse> => {
    const response = await api.post<AttendanceResponse>('/attendance/check-out');
    return response.data;
  },

  getToday: async (): Promise<AttendanceResponse> => {
    const response = await api.get<AttendanceResponse>('/attendance/today');
    return response.data;
  },

  getWeek: async (): Promise<AttendanceListResponse> => {
    const response = await api.get<AttendanceListResponse>('/attendance/week');
    return response.data;
  },

  getAll: async (filters: { employeeId?: string; date?: string } = {}): Promise<AttendanceListResponse> => {
    const response = await api.get<AttendanceListResponse>('/attendance/all', { params: filters });
    return response.data;
  },
};
export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email?: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  remarks?: string;
  status: LeaveStatus;
  admin_comment?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalanceSummary {
  paid_leave: {
    total: number;
    used: number;
    available: number;
  };
  sick_leave: {
    total: number;
    used: number;
    available: number;
  };
  unpaid_leave: {
    used: number;
    policy: string;
  };
}

export interface CreateLeavePayload {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  remarks?: string;
}

export interface ReviewLeavePayload {
  admin_comment?: string;
}

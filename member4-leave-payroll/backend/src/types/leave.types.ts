export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateLeaveDto {
  leave_type: LeaveType;
  start_date: string; // ISO date string (YYYY-MM-DD)
  end_date: string;   // ISO date string (YYYY-MM-DD)
  remarks?: string;
}

export interface ReviewLeaveDto {
  admin_comment?: string;
}

export interface LeaveFilterQuery {
  status?: LeaveStatus;
  leave_type?: LeaveType;
  search?: string;
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

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  remarks?: string;
  status: LeaveStatus;
  applied_at: string;
  approved_by?: string;
  admin_comment?: string;
}

export interface LeaveBalanceSummary {
  paid_leave: { total: number; used: number; available: number };
  sick_leave: { total: number; used: number; available: number };
  unpaid_leave: { used: number };
}

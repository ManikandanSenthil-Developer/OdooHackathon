export interface EmployeeDashboardData {
  profile: {
    name: string;
    email: string;
    jobTitle: string;
    department: string;
    employeeId: string;
  };
  attendance: {
    status: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    todayHours: number;
  };
  leaveRequests: {
    recentRequests: Array<{
      id: string;
      type: string;
      dates: string;
      days: number;
      reason: string;
      status: string;
    }>;
  };
  salary: {
    netPay: string;
    payCycle: string;
  };
}

export interface AdminDashboardData {
  stats: {
    totalEmployees: number;
    admins: number;
    employees: number;
    presentTodayCount: number;
    pendingLeaveApprovals: number;
    monthlyPayrollTotal: string;
  };
  attendanceSummary: {
    onTimeRate: string;
    departmentBreakdown: Array<{
      department: string;
      present: number;
      total: number;
    }>;
  };
  leaveApprovals: Array<{
    id: string;
    employeeName: string;
    employeeId: string;
    type: string;
    dates: string;
    totalDays: number;
    reason: string;
    status: string;
    appliedAt: string;
  }>;
  payrollOverview: {
    totalDisbursedMonthly: string;
    currentCycle: string;
  };
}

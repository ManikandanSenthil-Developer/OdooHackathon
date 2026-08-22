import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { userService } from '../services/userService';

/**
 * Employee Dashboard Data API
 * GET /api/dashboard/employee
 * Accessible by authenticated Employees (and Admins)
 */
export const getEmployeeDashboardData = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = userId ? await userService.findById(userId) : null;

    const profile = {
      name: user?.name || 'Employee',
      email: user?.email || '',
      role: user?.role || 'EMPLOYEE',
      department: 'Engineering & HR Tech',
      jobTitle: 'Software Engineer',
      employeeId: `EMP-${user?.id?.substring(0, 6).toUpperCase() || '001'}`,
      joinDate: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Jan 15, 2024',
      status: 'Active',
    };

    const attendance = {
      todayStatus: 'Checked In',
      clockInTime: '09:00 AM',
      clockOutTime: '06:00 PM',
      workHoursToday: '8h 30m',
      monthlyAttendanceRate: 98.5,
      daysPresent: 21,
      totalWorkingDays: 22,
      recentLogs: [
        { date: 'Today', status: 'Present', checkIn: '09:00 AM', checkOut: '--' },
        { date: 'Yesterday', status: 'Present', checkIn: '08:55 AM', checkOut: '06:05 PM' },
        { date: 'Aug 20, 2026', status: 'Present', checkIn: '09:02 AM', checkOut: '06:00 PM' },
        { date: 'Aug 19, 2026', status: 'On Leave', checkIn: '--', checkOut: '--' },
      ],
    };

    const leaveRequests = {
      casualLeavesAvailable: 8,
      sickLeavesAvailable: 5,
      paidLeavesAvailable: 12,
      totalUsed: 3,
      recentRequests: [
        { id: 'LR-101', type: 'Casual Leave', dates: 'Aug 19, 2026', reason: 'Personal errands', status: 'Approved' },
        { id: 'LR-102', type: 'Sick Leave', dates: 'Jul 10, 2026', reason: 'Fever & Rest', status: 'Approved' },
        { id: 'LR-103', type: 'Paid Leave', dates: 'Sep 05 - Sep 08, 2026', reason: 'Family trip', status: 'Pending' },
      ],
    };

    const salary = {
      basePay: '$7,500.00',
      bonus: '$750.00',
      deductions: '$620.00',
      netPay: '$7,630.00',
      payCycle: 'Monthly (28th of every month)',
      lastPaymentDate: 'July 28, 2026',
      bankAccount: '•••• •••• •••• 4921',
      recentPaystubs: [
        { month: 'July 2026', amount: '$7,630.00', status: 'Paid', downloadUrl: '#' },
        { month: 'June 2026', amount: '$7,630.00', status: 'Paid', downloadUrl: '#' },
        { month: 'May 2026', amount: '$7,500.00', status: 'Paid', downloadUrl: '#' },
      ],
    };

    res.status(200).json({
      success: true,
      message: 'Employee dashboard data retrieved successfully',
      data: {
        profile,
        attendance,
        leaveRequests,
        salary,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee dashboard data',
      error: error.message,
    });
  }
};

/**
 * Admin Dashboard Data API
 * GET /api/dashboard/admin
 * Accessible ONLY by authenticated Admins
 */
export const getAdminDashboardData = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const rawUsers = await userService.findAllUsers();

    const users = rawUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));

    const totalEmployeesCount = users.length;
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const employeeCount = users.filter((u) => u.role === 'EMPLOYEE').length;

    const stats = {
      totalEmployees: totalEmployeesCount,
      admins: adminCount,
      employees: employeeCount,
      presentTodayCount: Math.max(1, Math.round(totalEmployeesCount * 0.92)),
      pendingLeaveApprovals: 3,
      monthlyPayrollTotal: '$148,500.00',
    };

    const attendanceSummary = {
      onTimeRate: '96.2%',
      lateArrivals: 2,
      absentCount: 1,
      departmentBreakdown: [
        { department: 'Engineering', present: 14, total: 15 },
        { department: 'Human Resources', present: 5, total: 5 },
        { department: 'Marketing', present: 8, total: 9 },
        { department: 'Sales', present: 12, total: 12 },
      ],
    };

    const leaveApprovals = [
      { id: 'LA-501', employeeName: 'Sarah Connor', department: 'Engineering', type: 'Annual Leave', dates: 'Aug 25 - Aug 28', reason: 'Vacation', status: 'Pending' },
      { id: 'LA-502', employeeName: 'Michael Scott', department: 'Sales', type: 'Casual Leave', dates: 'Aug 29', reason: 'Personal Work', status: 'Pending' },
      { id: 'LA-503', employeeName: 'Pam Beesly', department: 'HR Tech', type: 'Sick Leave', dates: 'Aug 24', reason: 'Doctor Visit', status: 'Pending' },
    ];

    const payrollOverview = {
      currentCycle: 'August 2026',
      totalDisbursed: '$148,500.00',
      nextPayoutDate: 'August 28, 2026',
      status: 'Ready for Processing',
    };

    res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: {
        stats,
        users,
        attendanceSummary,
        leaveApprovals,
        payrollOverview,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard data',
      error: error.message,
    });
  }
};

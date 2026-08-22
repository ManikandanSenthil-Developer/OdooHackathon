import { EmployeeService } from './employeeService';
import { AttendanceService } from './attendanceService';
import { LeaveService } from './leaveService';
import { PayrollService } from './payrollService';
import { UserService } from './userService';
import { formatCurrency } from '../utils/salaryCalculator';

export class DashboardService {
  static async getEmployeeDashboard(
    userId: string,
    employeeId = 'EMP001',
    userName = 'Sarah Connor',
    userEmail = 'employee@dayflow.com'
  ) {
    // 1. Fetch Employee record
    let emp: any = null;
    try {
      emp = await EmployeeService.getEmployeeById(employeeId);
    } catch {
      emp = await EmployeeService.getEmployeeByEmail(userEmail);
    }

    const profile = {
      name: emp?.name || userName,
      email: emp?.email || userEmail,
      role: 'EMPLOYEE',
      department: emp?.department || 'Engineering & HR Tech',
      jobTitle: emp?.designation || 'Senior Software Engineer',
      employeeId: emp?.employee_id || employeeId,
      joinDate: emp?.joining_date
        ? new Date(emp.joining_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Jan 15, 2024',
      status: 'Active',
      profilePicture: emp?.profile_picture || null,
      phone: emp?.phone || '+1 (555) 234-5678',
      address: emp?.address || '101 Cyberdyne Way, Los Angeles, CA',
    };

    // 2. Attendance summary
    const todayAttendance = await AttendanceService.findTodayAttendance(profile.employeeId);
    const weeklyAttendance = await AttendanceService.getWeeklyAttendance(profile.employeeId);

    const attendance = {
      todayStatus: todayAttendance?.checkIn
        ? todayAttendance.checkOut
          ? 'Checked Out'
          : 'Checked In'
        : 'Not Checked In',
      clockInTime: todayAttendance?.checkIn
        ? new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--',
      clockOutTime: todayAttendance?.checkOut
        ? new Date(todayAttendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--',
      workHoursToday: todayAttendance?.workingHours ? `${todayAttendance.workingHours}h` : '0h',
      monthlyAttendanceRate: 98.5,
      daysPresent: Math.max(1, weeklyAttendance.length),
      totalWorkingDays: 22,
      recentLogs: weeklyAttendance.map((a: any) => ({
        date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: a.status === 'PRESENT' ? 'Present' : a.status === 'LEAVE' ? 'On Leave' : 'Half Day',
        checkIn: a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
        checkOut: a.checkOut ? new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
      })),
    };

    // 3. Leave summary
    const balances = await LeaveService.getBalanceSummary(profile.employeeId);
    const leaves = await LeaveService.getEmployeeLeaves(profile.employeeId);

    const leaveRequests = {
      paidLeavesAvailable: balances.paid_leave.available,
      sickLeavesAvailable: balances.sick_leave.available,
      casualLeavesAvailable: 8,
      totalUsed: balances.paid_leave.used + balances.sick_leave.used,
      recentRequests: leaves.slice(0, 5).map((l: any) => ({
        id: l.id,
        type: l.leave_type === 'PAID' ? 'Paid Leave' : l.leave_type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave',
        dates: `${new Date(l.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(l.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        reason: l.remarks || 'Personal Leave',
        status: l.status === 'APPROVED' ? 'Approved' : l.status === 'REJECTED' ? 'Rejected' : 'Pending',
        totalDays: l.total_days,
      })),
    };

    // 4. Salary breakdown
    const payroll = await PayrollService.getEmployeeSalary(profile.employeeId, profile.name);

    const salary = {
      basePay: formatCurrency(Number(payroll.basic_salary)),
      bonus: formatCurrency(Number(payroll.total_allowances)),
      deductions: formatCurrency(Number(payroll.total_deductions)),
      netPay: formatCurrency(Number(payroll.net_salary)),
      payCycle: payroll.pay_cycle || 'Monthly (28th of every month)',
      lastPaymentDate: 'July 28, 2026',
      bankAccount: payroll.bank_account_mask || '•••• •••• •••• 4921',
      recentPaystubs: (payroll.paystubs || []).map((p: any) => ({
        month: p.month,
        amount: formatCurrency(Number(p.amount)),
        status: p.status,
        downloadUrl: '#',
      })),
    };

    return {
      profile,
      attendance,
      leaveRequests,
      salary,
    };
  }

  static async getAdminDashboard() {
    const rawUsers = await UserService.findAllUsers();
    const employeesRes = await EmployeeService.getEmployees({ limit: 100 });
    const employees = employeesRes.data;

    const allLeaves = await LeaveService.getAllLeavesForAdmin({});
    const pendingLeaves = allLeaves.filter((l: any) => l.status === 'PENDING');

    const allPayrolls = await PayrollService.getAllPayrollsForAdmin({});
    const totalPayrollAmount = allPayrolls.reduce(
      (sum, p: any) => sum + Number(p.net_salary || 0),
      0
    );

    const stats = {
      totalEmployees: Math.max(employees.length, rawUsers.length),
      admins: rawUsers.filter((u) => u.role === 'ADMIN').length || 1,
      employees: employees.length || rawUsers.length,
      presentTodayCount: Math.max(1, Math.round((employees.length || 4) * 0.9)),
      pendingLeaveApprovals: pendingLeaves.length,
      monthlyPayrollTotal: formatCurrency(totalPayrollAmount || 148500),
    };

    const attendanceSummary = {
      onTimeRate: '96.2%',
      lateArrivals: 2,
      absentCount: Math.max(0, stats.totalEmployees - stats.presentTodayCount),
      departmentBreakdown: [
        { department: 'Engineering', present: 14, total: 15 },
        { department: 'Human Resources', present: 5, total: 5 },
        { department: 'Marketing', present: 8, total: 9 },
        { department: 'Sales', present: 12, total: 12 },
      ],
    };

    const leaveApprovals = pendingLeaves.map((l: any) => ({
      id: l.id,
      employeeName: l.employee_name,
      employeeId: l.employee_id,
      type: l.leave_type === 'PAID' ? 'Paid Leave' : l.leave_type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave',
      dates: `${new Date(l.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(l.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      reason: l.remarks || 'Personal',
      status: l.status,
      totalDays: l.total_days,
    }));

    const payrollOverview = {
      currentCycle: 'August 2026',
      totalDisbursed: formatCurrency(totalPayrollAmount || 148500),
      nextPayoutDate: 'August 28, 2026',
      status: 'Ready for Processing',
      recordsCount: allPayrolls.length,
    };

    return {
      stats,
      users: rawUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        employee_id: u.employee_id,
        createdAt: u.createdAt,
      })),
      attendanceSummary,
      leaveApprovals,
      payrollOverview,
    };
  }
}


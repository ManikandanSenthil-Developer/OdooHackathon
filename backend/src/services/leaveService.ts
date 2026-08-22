import { LeaveStatus, LeaveType } from '@prisma/client';
import { prisma } from '../prisma/client';
import { calculateTotalDays, parseDateOrThrow } from '../utils/dateUtils';

export interface CreateLeaveDto {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  remarks?: string;
}

export interface LeaveFilterQuery {
  status?: LeaveStatus;
  leave_type?: LeaveType;
  search?: string;
}

interface MemLeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email?: string | null;
  leave_type: LeaveType;
  start_date: Date;
  end_date: Date;
  total_days: number;
  remarks?: string | null;
  status: LeaveStatus;
  admin_comment?: string | null;
  approved_by?: string | null;
  approved_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface MemLeaveBalance {
  id: string;
  employee_id: string;
  paid_leave_total: number;
  paid_leave_used: number;
  sick_leave_total: number;
  sick_leave_used: number;
  unpaid_leave_used: number;
  updated_at: Date;
}

const memoryBalances = new Map<string, MemLeaveBalance>();
const memoryLeaves: MemLeaveRequest[] = [
  {
    id: 'lr-demo-01',
    employee_id: 'EMP001',
    employee_name: 'Sarah Connor',
    employee_email: 'employee@dayflow.com',
    leave_type: LeaveType.PAID,
    start_date: new Date(Date.now() + 4 * 86400000),
    end_date: new Date(Date.now() + 6 * 86400000),
    total_days: 3,
    remarks: 'Family vacation and personal downtime',
    status: LeaveStatus.PENDING,
    created_at: new Date(Date.now() - 86400000),
    updated_at: new Date(Date.now() - 86400000),
  },
  {
    id: 'lr-demo-02',
    employee_id: 'EMP001',
    employee_name: 'Sarah Connor',
    employee_email: 'employee@dayflow.com',
    leave_type: LeaveType.SICK,
    start_date: new Date(Date.now() - 15 * 86400000),
    end_date: new Date(Date.now() - 13 * 86400000),
    total_days: 2,
    remarks: 'Doctor appointment and fever recovery',
    status: LeaveStatus.APPROVED,
    admin_comment: 'Approved by HR Lead. Get well soon!',
    approved_by: 'Alex Rivera (HR Lead)',
    approved_at: new Date(Date.now() - 14 * 86400000),
    created_at: new Date(Date.now() - 15 * 86400000),
    updated_at: new Date(Date.now() - 14 * 86400000),
  },
  {
    id: 'lr-demo-03',
    employee_id: 'EMP002',
    employee_name: 'Michael Scott',
    employee_email: 'michael@dayflow.com',
    leave_type: LeaveType.PAID,
    start_date: new Date(Date.now() + 8 * 86400000),
    end_date: new Date(Date.now() + 9 * 86400000),
    total_days: 2,
    remarks: 'Management regional seminar',
    status: LeaveStatus.PENDING,
    created_at: new Date(Date.now() - 2 * 86400000),
    updated_at: new Date(Date.now() - 2 * 86400000),
  },
];

export class LeaveService {
  static async getOrCreateBalance(employeeId: string) {
    try {
      let balance = await prisma.leaveBalance.findUnique({
        where: { employee_id: employeeId },
      });

      if (!balance) {
        balance = await prisma.leaveBalance.create({
          data: {
            employee_id: employeeId,
            paid_leave_total: 18,
            paid_leave_used: 4,
            sick_leave_total: 12,
            sick_leave_used: 2,
            unpaid_leave_used: 0,
          },
        });
      }
      return balance;
    } catch {
      let memBal = memoryBalances.get(employeeId);
      if (!memBal) {
        memBal = {
          id: 'bal-' + employeeId,
          employee_id: employeeId,
          paid_leave_total: 18,
          paid_leave_used: 4,
          sick_leave_total: 12,
          sick_leave_used: 2,
          unpaid_leave_used: 0,
          updated_at: new Date(),
        };
        memoryBalances.set(employeeId, memBal);
      }
      return memBal;
    }
  }

  static async getBalanceSummary(employeeId: string) {
    const balance = await this.getOrCreateBalance(employeeId);

    return {
      paid_leave: {
        total: balance.paid_leave_total,
        used: balance.paid_leave_used,
        available: Math.max(0, balance.paid_leave_total - balance.paid_leave_used),
      },
      sick_leave: {
        total: balance.sick_leave_total,
        used: balance.sick_leave_used,
        available: Math.max(0, balance.sick_leave_total - balance.sick_leave_used),
      },
      unpaid_leave: {
        used: balance.unpaid_leave_used,
        policy: 'Subject to management review and approval',
      },
    };
  }

  static async applyLeave(
    employeeId: string,
    employeeName: string,
    employeeEmail: string | undefined,
    data: CreateLeaveDto
  ) {
    const validTypes: LeaveType[] = [LeaveType.PAID, LeaveType.SICK, LeaveType.UNPAID];
    if (!validTypes.includes(data.leave_type)) {
      throw { statusCode: 400, message: 'Invalid leave type. Allowed: PAID, SICK, UNPAID' };
    }

    const startDate = parseDateOrThrow(data.start_date, 'Start Date');
    const endDate = parseDateOrThrow(data.end_date, 'End Date');

    if (startDate > endDate) {
      throw { statusCode: 400, message: 'Start date cannot be after end date.' };
    }

    const totalDays = calculateTotalDays(startDate, endDate);
    const balance = await this.getOrCreateBalance(employeeId);

    if (data.leave_type === LeaveType.PAID) {
      const available = balance.paid_leave_total - balance.paid_leave_used;
      if (totalDays > available) {
        throw {
          statusCode: 400,
          message: `Insufficient paid leave balance. Requested: ${totalDays} day(s), Available: ${available} day(s).`,
        };
      }
    } else if (data.leave_type === LeaveType.SICK) {
      const available = balance.sick_leave_total - balance.sick_leave_used;
      if (totalDays > available) {
        throw {
          statusCode: 400,
          message: `Insufficient sick leave balance. Requested: ${totalDays} day(s), Available: ${available} day(s).`,
        };
      }
    }

    try {
      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          employee_id: employeeId,
          employee_name: employeeName,
          employee_email: employeeEmail || null,
          leave_type: data.leave_type,
          start_date: startDate,
          end_date: endDate,
          total_days: totalDays,
          remarks: data.remarks || '',
          status: LeaveStatus.PENDING,
        },
      });
      return leaveRequest;
    } catch {
      const memLeave: MemLeaveRequest = {
        id: 'lr-' + Math.random().toString(36).substring(2, 9),
        employee_id: employeeId,
        employee_name: employeeName,
        employee_email: employeeEmail,
        leave_type: data.leave_type,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        remarks: data.remarks || '',
        status: LeaveStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      };
      memoryLeaves.unshift(memLeave);
      return memLeave;
    }
  }

  static async getEmployeeLeaves(employeeId: string) {
    try {
      return await prisma.leaveRequest.findMany({
        where: { employee_id: employeeId },
        orderBy: { created_at: 'desc' },
      });
    } catch {
      return memoryLeaves
        .filter((l) => l.employee_id === employeeId)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
  }

  static async getLeaveById(id: string, userEmployeeId?: string, isAdmin = false) {
    let leave: any = null;
    try {
      leave = await prisma.leaveRequest.findUnique({ where: { id } });
    } catch {
      leave = memoryLeaves.find((l) => l.id === id) || null;
    }

    if (!leave) {
      throw { statusCode: 404, message: 'Leave request not found' };
    }

    if (!isAdmin && leave.employee_id !== userEmployeeId) {
      throw { statusCode: 403, message: 'Forbidden. You can only view your own leave requests' };
    }

    return leave;
  }

  static async getAllLeavesForAdmin(filters: LeaveFilterQuery) {
    try {
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.leave_type) where.leave_type = filters.leave_type;
      if (filters.search && filters.search.trim() !== '') {
        const search = filters.search.trim();
        where.OR = [
          { employee_name: { contains: search } },
          { employee_id: { contains: search } },
          { remarks: { contains: search } },
        ];
      }

      return await prisma.leaveRequest.findMany({
        where,
        orderBy: { created_at: 'desc' },
      });
    } catch {
      return memoryLeaves
        .filter((l) => {
          if (filters.status && l.status !== filters.status) return false;
          if (filters.leave_type && l.leave_type !== filters.leave_type) return false;
          if (filters.search && filters.search.trim() !== '') {
            const q = filters.search.toLowerCase();
            return (
              l.employee_name.toLowerCase().includes(q) ||
              l.employee_id.toLowerCase().includes(q) ||
              (l.remarks && l.remarks.toLowerCase().includes(q))
            );
          }
          return true;
        })
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
  }

  static async approveLeave(id: string, adminName: string, adminComment?: string) {
    const leave = await this.getLeaveById(id, undefined, true);

    if (leave.status === LeaveStatus.APPROVED) {
      throw { statusCode: 400, message: 'Leave request has already been approved' };
    }
    if (leave.status === LeaveStatus.REJECTED) {
      throw { statusCode: 400, message: 'Cannot approve a leave request that was previously rejected' };
    }

    const balance = await this.getOrCreateBalance(leave.employee_id);
    const updatedBalanceUsed =
      leave.leave_type === LeaveType.PAID
        ? balance.paid_leave_used + leave.total_days
        : leave.leave_type === LeaveType.SICK
        ? balance.sick_leave_used + leave.total_days
        : balance.unpaid_leave_used + leave.total_days;

    try {
      if (leave.leave_type === LeaveType.PAID) {
        await prisma.leaveBalance.update({
          where: { employee_id: leave.employee_id },
          data: { paid_leave_used: updatedBalanceUsed },
        });
      } else if (leave.leave_type === LeaveType.SICK) {
        await prisma.leaveBalance.update({
          where: { employee_id: leave.employee_id },
          data: { sick_leave_used: updatedBalanceUsed },
        });
      } else {
        await prisma.leaveBalance.update({
          where: { employee_id: leave.employee_id },
          data: { unpaid_leave_used: updatedBalanceUsed },
        });
      }

      const updated = await prisma.leaveRequest.update({
        where: { id },
        data: {
          status: LeaveStatus.APPROVED,
          admin_comment: adminComment || 'Approved by HR Administration',
          approved_by: adminName,
          approved_at: new Date(),
        },
      });

      return updated;
    } catch {
      if (leave.leave_type === LeaveType.PAID) balance.paid_leave_used = updatedBalanceUsed;
      if (leave.leave_type === LeaveType.SICK) balance.sick_leave_used = updatedBalanceUsed;
      if (leave.leave_type === LeaveType.UNPAID) balance.unpaid_leave_used = updatedBalanceUsed;

      leave.status = LeaveStatus.APPROVED;
      leave.admin_comment = adminComment || 'Approved by HR Administration';
      leave.approved_by = adminName;
      leave.approved_at = new Date();
      leave.updated_at = new Date();
      return leave;
    }
  }

  static async rejectLeave(id: string, adminName: string, adminComment?: string) {
    const leave = await this.getLeaveById(id, undefined, true);

    if (leave.status === LeaveStatus.REJECTED) {
      throw { statusCode: 400, message: 'Leave request has already been rejected' };
    }
    if (leave.status === LeaveStatus.APPROVED) {
      throw { statusCode: 400, message: 'Cannot reject a leave request that was previously approved' };
    }

    try {
      const updated = await prisma.leaveRequest.update({
        where: { id },
        data: {
          status: LeaveStatus.REJECTED,
          admin_comment: adminComment || 'Request declined by HR administration',
          approved_by: adminName,
          approved_at: new Date(),
        },
      });
      return updated;
    } catch {
      leave.status = LeaveStatus.REJECTED;
      leave.admin_comment = adminComment || 'Request declined by HR administration';
      leave.approved_by = adminName;
      leave.approved_at = new Date();
      leave.updated_at = new Date();
      return leave;
    }
  }
}


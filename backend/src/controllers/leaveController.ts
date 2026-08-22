import { Response, NextFunction } from 'express';
import { LeaveService } from '../services/leaveService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { createLeaveSchema, reviewLeaveSchema } from '../validators/schemas';

export const applyLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createLeaveSchema.parse(req.body);
    const employeeId = req.user?.employee_id || 'EMP001';
    const employeeName = req.user?.name || 'Employee';
    const employeeEmail = req.user?.email;

    const result = await LeaveService.applyLeave(employeeId, employeeName, employeeEmail, validated);

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyLeaves = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id || 'EMP001';
    const leaves = await LeaveService.getEmployeeLeaves(employeeId);
    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id || 'EMP001';
    const balances = await LeaveService.getBalanceSummary(employeeId);
    res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const employeeId = req.user?.employee_id;
    const isAdmin = req.user?.role === 'ADMIN';

    const leave = await LeaveService.getLeaveById(id, employeeId, isAdmin);
    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminLeaves = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, leave_type, search } = req.query;
    const leaves = await LeaveService.getAllLeavesForAdmin({
      status: status as any,
      leave_type: leave_type as any,
      search: search as string,
    });
    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminLeaveHistory = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const leaves = await LeaveService.getAllLeavesForAdmin({});
    const history = leaves.filter((l: any) => l.status !== 'PENDING');
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const approveLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = reviewLeaveSchema.parse(req.body);
    const adminName = req.user?.name || 'HR Administrator';

    const updated = await LeaveService.approveLeave(id, adminName, validated.admin_comment);
    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = reviewLeaveSchema.parse(req.body);
    const adminName = req.user?.name || 'HR Administrator';

    const updated = await LeaveService.rejectLeave(id, adminName, validated.admin_comment);
    res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};


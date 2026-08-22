import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authAdapter';
import { LeaveService } from '../services/leave.service';

export class LeaveController {
  /**
   * POST /api/leave - Apply for Leave (Employee)
   */
  static async applyLeave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.user?.employee_id || `EMP-${req.user?.id.substring(0, 6).toUpperCase()}`;
      const employeeName = req.user?.name || 'Employee';
      const employeeEmail = req.user?.email;

      const result = await LeaveService.applyLeave(employeeId, employeeName, employeeEmail, req.body);

      res.status(201).json({
        success: true,
        message: 'Leave request submitted successfully.',
        data: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to submit leave request.',
      });
    }
  }

  /**
   * GET /api/leave/my - Get Employee's Leave History
   */
  static async getMyLeaves(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.user?.employee_id || `EMP-${req.user?.id.substring(0, 6).toUpperCase()}`;
      const leaves = await LeaveService.getEmployeeLeaves(employeeId);

      res.status(200).json({
        success: true,
        message: 'Leave history retrieved successfully.',
        data: leaves,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve leave history.',
      });
    }
  }

  /**
   * GET /api/leave/balance - Get Employee's Leave Balances
   */
  static async getMyBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.user?.employee_id || `EMP-${req.user?.id.substring(0, 6).toUpperCase()}`;
      const balances = await LeaveService.getBalanceSummary(employeeId);

      res.status(200).json({
        success: true,
        message: 'Leave balance retrieved successfully.',
        data: balances,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve leave balance.',
      });
    }
  }

  /**
   * GET /api/leave/:id - Get Single Leave Request Details
   */
  static async getLeaveById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employeeId = req.user?.employee_id;
      const isAdmin = req.user?.role === 'ADMIN';

      const leave = await LeaveService.getLeaveById(id, employeeId, isAdmin);

      res.status(200).json({
        success: true,
        message: 'Leave request details retrieved successfully.',
        data: leave,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve leave details.',
      });
    }
  }

  /**
   * GET /api/admin/leave - Admin: Get All Leave Requests (Search & Filter)
   */
  static async getAdminLeaves(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status, leave_type, search } = req.query;
      const leaves = await LeaveService.getAllLeavesForAdmin({
        status: status as any,
        leave_type: leave_type as any,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        message: 'Admin leave requests retrieved successfully.',
        data: leaves,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve leave requests for admin.',
      });
    }
  }

  /**
   * GET /api/admin/leave/history - Admin: Get Processed Leave Requests
   */
  static async getAdminLeaveHistory(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaves = await LeaveService.getAllLeavesForAdmin({});
      const history = leaves.filter((l) => l.status !== 'PENDING');

      res.status(200).json({
        success: true,
        message: 'Leave history retrieved successfully.',
        data: history,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve leave history.',
      });
    }
  }

  /**
   * PUT /api/admin/leave/:id/approve - Admin: Approve Leave Request
   */
  static async approveLeave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { admin_comment } = req.body;
      const adminName = req.user?.name || 'HR Officer';

      const updated = await LeaveService.approveLeave(id, adminName, admin_comment);

      res.status(200).json({
        success: true,
        message: 'Leave request approved successfully.',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to approve leave request.',
      });
    }
  }

  /**
   * PUT /api/admin/leave/:id/reject - Admin: Reject Leave Request
   */
  static async rejectLeave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { admin_comment } = req.body;
      const adminName = req.user?.name || 'HR Officer';

      const updated = await LeaveService.rejectLeave(id, adminName, admin_comment);

      res.status(200).json({
        success: true,
        message: 'Leave request rejected successfully.',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to reject leave request.',
      });
    }
  }
}

import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getEmployeeDashboardData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id || 'usr_emp_001';
    const employeeId = req.user?.employee_id || 'EMP001';
    const userName = req.user?.name || 'Sarah Connor';
    const userEmail = req.user?.email || 'employee@dayflow.com';

    const data = await DashboardService.getEmployeeDashboard(userId, employeeId, userName, userEmail);

    res.status(200).json({
      success: true,
      message: 'Employee dashboard data retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboardData = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await DashboardService.getAdminDashboard();

    res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};


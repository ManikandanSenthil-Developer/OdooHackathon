import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authAdapter';
import { PayrollService } from '../services/payroll.service';

export class PayrollController {
  /**
   * GET /api/payroll/my - Get Employee's Own Salary (Read-Only)
   */
  static async getMySalary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.user?.employee_id || `EMP-${req.user?.id.substring(0, 6).toUpperCase()}`;
      const employeeName = req.user?.name || 'Employee';

      const salary = await PayrollService.getEmployeeSalary(employeeId, employeeName);

      res.status(200).json({
        success: true,
        message: 'Salary details retrieved successfully.',
        data: salary,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve salary details.',
      });
    }
  }

  /**
   * GET /api/admin/payroll - Admin: Get All Employees' Payroll
   */
  static async getAllPayrolls(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { search, department } = req.query;
      const payrolls = await PayrollService.getAllPayrollsForAdmin({
        search: search as string,
        department: department as string,
      });

      res.status(200).json({
        success: true,
        message: 'All payroll records retrieved successfully.',
        data: payrolls,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve payroll list.',
      });
    }
  }

  /**
   * GET /api/admin/payroll/:employeeId - Admin: Get Specific Employee Payroll
   */
  static async getPayrollByEmployeeId(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { employeeId } = req.params;
      const payroll = await PayrollService.getPayrollByEmployeeId(employeeId);

      res.status(200).json({
        success: true,
        message: 'Employee payroll details retrieved successfully.',
        data: payroll,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve employee payroll.',
      });
    }
  }

  /**
   * PUT /api/admin/payroll/:employeeId - Admin: Update Salary Structure
   */
  static async updateSalaryStructure(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { employeeId } = req.params;
      const updated = await PayrollService.updateSalaryStructure(employeeId, req.body);

      res.status(200).json({
        success: true,
        message: 'Salary structure updated successfully.',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update salary structure.',
      });
    }
  }
}

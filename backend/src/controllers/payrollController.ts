import { Response, NextFunction } from 'express';
import { PayrollService } from '../services/payrollService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { updateSalarySchema } from '../validators/schemas';

export const getMySalary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id || 'EMP001';
    const employeeName = req.user?.name || 'Employee';

    const salary = await PayrollService.getEmployeeSalary(employeeId, employeeName);
    res.status(200).json({
      success: true,
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayrolls = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { search, department } = req.query;
    const payrolls = await PayrollService.getAllPayrollsForAdmin({
      search: search as string,
      department: department as string,
    });
    res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayrollByEmployeeId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const payroll = await PayrollService.getPayrollByEmployeeId(employeeId);
    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSalaryStructure = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const validated = updateSalarySchema.parse(req.body);

    const updated = await PayrollService.updateSalaryStructure(employeeId, validated);
    res.status(200).json({
      success: true,
      message: 'Salary structure updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};


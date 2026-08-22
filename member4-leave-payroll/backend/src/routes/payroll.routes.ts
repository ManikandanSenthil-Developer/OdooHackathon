import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller';
import { authAdapter } from '../middleware/authAdapter';
import { requireAdmin, requireEmployeeOrAdmin } from '../middleware/role.middleware';

const router = Router();

// Employee route (Read-Only)
router.get('/payroll/my', authAdapter, requireEmployeeOrAdmin, PayrollController.getMySalary);

// Admin routes
router.get('/admin/payroll', authAdapter, requireAdmin, PayrollController.getAllPayrolls);
router.get('/admin/payroll/:employeeId', authAdapter, requireAdmin, PayrollController.getPayrollByEmployeeId);
router.put('/admin/payroll/:employeeId', authAdapter, requireAdmin, PayrollController.updateSalaryStructure);

export default router;

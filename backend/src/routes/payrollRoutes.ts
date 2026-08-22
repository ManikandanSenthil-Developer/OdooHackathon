import { Router } from 'express';
import {
  getMySalary,
  getAllPayrolls,
  getPayrollByEmployeeId,
  updateSalaryStructure,
} from '../controllers/payrollController';
import { verifyToken, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

// Employee read-only salary
router.get('/my', getMySalary);

// Admin-only compensation routes
router.get('/admin', adminOnly, getAllPayrolls);
router.get('/admin/:employeeId', adminOnly, getPayrollByEmployeeId);
router.put('/admin/:employeeId', adminOnly, updateSalaryStructure);

// Top-level aliases
router.get('/', adminOnly, getAllPayrolls);
router.get('/:employeeId', adminOnly, getPayrollByEmployeeId);
router.put('/:employeeId', adminOnly, updateSalaryStructure);

export default router;


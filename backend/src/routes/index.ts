import { Router } from 'express';
import authRoutes from './authRoutes';
import employeeRoutes from './employeeRoutes';
import documentRoutes from './documentRoutes';
import attendanceRoutes from './attendanceRoutes';
import leaveRoutes from './leaveRoutes';
import payrollRoutes from './payrollRoutes';
import dashboardRoutes from './dashboardRoutes';
import {
  getAdminLeaves,
  getAdminLeaveHistory,
  approveLeave,
  rejectLeave,
} from '../controllers/leaveController';
import {
  getAllPayrolls,
  getPayrollByEmployeeId,
  updateSalaryStructure,
} from '../controllers/payrollController';
import { verifyToken, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Modular Sub-routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leave', leaveRoutes);
router.use('/leaves', leaveRoutes); // Plural alias
router.use('/payroll', payrollRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/', documentRoutes);

// Admin dedicated path aliases for Module 4 direct contract compatibility
const adminRouter = Router();
adminRouter.use(verifyToken, adminOnly);
adminRouter.get('/leave', getAdminLeaves);
adminRouter.get('/leave/history', getAdminLeaveHistory);
adminRouter.put('/leave/:id/approve', approveLeave);
adminRouter.put('/leave/:id/reject', rejectLeave);

adminRouter.get('/payroll', getAllPayrolls);
adminRouter.get('/payroll/:employeeId', getPayrollByEmployeeId);
adminRouter.put('/payroll/:employeeId', updateSalaryStructure);

router.use('/admin', adminRouter);

// Base API Healthcheck
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    system: 'Dayflow HRMS Unified API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;


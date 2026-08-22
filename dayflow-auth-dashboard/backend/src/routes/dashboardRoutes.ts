import { Router } from 'express';
import {
  getEmployeeDashboardData,
  getAdminDashboardData,
} from '../controllers/dashboardController';
import {
  verifyToken,
  employeeOnly,
  adminOnly,
} from '../middleware/authMiddleware';

const router = Router();

// Employee Dashboard API - Accessible by EMPLOYEE & ADMIN
router.get('/employee', verifyToken, employeeOnly, getEmployeeDashboardData);

// Admin Dashboard API - Accessible ONLY by ADMIN
router.get('/admin', verifyToken, adminOnly, getAdminDashboardData);

export default router;

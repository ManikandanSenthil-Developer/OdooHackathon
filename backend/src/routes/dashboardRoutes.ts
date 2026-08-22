import { Router } from 'express';
import {
  getEmployeeDashboardData,
  getAdminDashboardData,
} from '../controllers/dashboardController';
import { verifyToken, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/employee', getEmployeeDashboardData);
router.get('/admin', adminOnly, getAdminDashboardData);

export default router;


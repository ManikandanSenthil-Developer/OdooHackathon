import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { authAdapter } from '../middleware/authAdapter';
import { requireAdmin, requireEmployeeOrAdmin } from '../middleware/role.middleware';

const router = Router();

// Employee routes
router.post('/leave', authAdapter, requireEmployeeOrAdmin, LeaveController.applyLeave);
router.get('/leave/my', authAdapter, requireEmployeeOrAdmin, LeaveController.getMyLeaves);
router.get('/leave/balance', authAdapter, requireEmployeeOrAdmin, LeaveController.getMyBalance);
router.get('/leave/:id', authAdapter, requireEmployeeOrAdmin, LeaveController.getLeaveById);

// Admin routes
router.get('/admin/leave', authAdapter, requireAdmin, LeaveController.getAdminLeaves);
router.get('/admin/leave/history', authAdapter, requireAdmin, LeaveController.getAdminLeaveHistory);
router.get('/admin/leave/:id', authAdapter, requireAdmin, LeaveController.getLeaveById);
router.put('/admin/leave/:id/approve', authAdapter, requireAdmin, LeaveController.approveLeave);
router.put('/admin/leave/:id/reject', authAdapter, requireAdmin, LeaveController.rejectLeave);

export default router;

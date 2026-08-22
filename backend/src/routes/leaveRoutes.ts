import { Router } from 'express';
import {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getLeaveById,
  getAdminLeaves,
  getAdminLeaveHistory,
  approveLeave,
  rejectLeave,
} from '../controllers/leaveController';
import { verifyToken, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

// Employee endpoints
router.post('/', applyLeave);
router.post('/apply', applyLeave);
router.get('/my', getMyLeaves);
router.get('/balance', getMyBalance);
router.get('/detail/:id', getLeaveById);

// Admin-only review endpoints
router.get('/admin', adminOnly, getAdminLeaves);
router.get('/admin/history', adminOnly, getAdminLeaveHistory);
router.put('/admin/:id/approve', adminOnly, approveLeave);
router.put('/admin/:id/reject', adminOnly, rejectLeave);

// Direct ID lookup (owner or admin)
router.get('/:id', getLeaveById);

export default router;


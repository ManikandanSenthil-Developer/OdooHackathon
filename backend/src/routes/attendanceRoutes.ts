import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getWeeklyAttendance,
  getAllAttendance,
} from '../controllers/attendanceController';
import { verifyToken, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

// Employee / Shared endpoints
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayAttendance);
router.get('/week', getWeeklyAttendance);

// Admin-only oversight endpoint
router.get('/all', adminOnly, getAllAttendance);

export default router;


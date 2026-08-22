import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getWeeklyAttendance,
  getAllAttendance,
} from '../controllers/attendanceController';
import {
  adminOnly,
  employeeOnly,
} from '../middleware/authMiddleware';

const router = Router();

// TEMP: Authentication disabled for standalone Member 3 testing.
// Restore verifyToken before final merge.
router.get("/today", getTodayAttendance);
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/week", getWeeklyAttendance);

// The complete attendance list is restricted to administrators.
router.get('/all', adminOnly, getAllAttendance);

export default router;
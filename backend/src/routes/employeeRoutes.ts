import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateOwnProfile,
  uploadProfilePicture,
  deleteEmployee,
  getEmployeeStats,
} from '../controllers/employeeController';
import { verifyToken, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(verifyToken);

// Admin / HR routes
router.get('/stats', adminOnly, getEmployeeStats);
router.get('/', adminOnly, getEmployees);
router.post('/', adminOnly, createEmployee);
router.put('/:employeeId', adminOnly, updateEmployee);
router.delete('/:employeeId', adminOnly, deleteEmployee);

// Employee / Shared routes
router.get('/:employeeId', getEmployeeById);
router.patch('/:employeeId/profile', updateOwnProfile);
router.patch(
  '/:employeeId/profile-picture',
  upload.single('profile_picture'),
  uploadProfilePicture
);

export default router;


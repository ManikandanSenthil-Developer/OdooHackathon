import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);

// Protected user route
router.get('/me', verifyToken, getMe);

export default router;

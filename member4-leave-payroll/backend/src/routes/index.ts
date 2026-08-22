import { Router } from 'express';
import leaveRoutes from './leave.routes';
import payrollRoutes from './payroll.routes';

const router = Router();

router.use('/', leaveRoutes);
router.use('/', payrollRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    module: 'Module 4 - Leave & Payroll Management',
    timestamp: new Date().toISOString(),
  });
});

export default router;

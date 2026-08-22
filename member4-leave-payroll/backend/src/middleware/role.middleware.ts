import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authAdapter';

/**
 * Admin Only Role Middleware
 * Blocks non-ADMIN users with a 403 Forbidden status.
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Authentication required.',
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to Admin / HR Officers only.',
    });
    return;
  }

  next();
};

/**
 * Employee Only Role Middleware
 */
export const requireEmployeeOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Authentication required.',
    });
    return;
  }

  if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to valid HRMS users.',
    });
    return;
  }

  next();
};

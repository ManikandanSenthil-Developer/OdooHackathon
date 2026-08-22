import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken, TokenPayload } from '../utils/jwt';

// Extend Express Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * JWT Authentication Middleware
 * Extracts token from 'Authorization: Bearer <token>' header and verifies signature.
 */
export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Authorization header with Bearer token is missing.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
    return;
  }
};

/**
 * Admin Only Role Middleware
 * Blocks non-ADMIN users with a 403 Forbidden status.
 */
export const adminOnly = (
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
 * Blocks users without valid role credentials.
 */
export const employeeOnly = (
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
      message: 'Forbidden. Access restricted to Employees.',
    });
    return;
  }

  next();
};

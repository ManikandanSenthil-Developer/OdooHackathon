import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedUser, UserRole } from '../types/auth.types';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Auth Adapter Middleware
 * Seamlessly consumes Member 1's JWT token payload: { id, email, role }
 * Provides DEV fallback headers when developing locally and DEV_MODE=true.
 */
export const authAdapter = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // 1. Production / Bearer JWT Path
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        id: string;
        email: string;
        role: UserRole;
        name?: string;
        employee_id?: string;
      };

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        employee_id: decoded.employee_id || `EMP-${decoded.id.substring(0, 6).toUpperCase()}`,
        name: decoded.name || (decoded.role === 'ADMIN' ? 'Admin / HR' : 'Employee User'),
      };
      return next();
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired JWT token. Please login via Member 1 Auth.',
      });
      return;
    }
  }

  // 2. DEV ONLY Standalone Fallback (Active only in development mode)
  if (config.devMode) {
    const mockRole = (req.headers['x-mock-role'] as UserRole) || 'EMPLOYEE';
    const mockId = (req.headers['x-mock-user-id'] as string) || (mockRole === 'ADMIN' ? 'usr_admin_01' : 'usr_emp_01');
    const mockEmployeeId = (req.headers['x-mock-employee-id'] as string) || (mockRole === 'ADMIN' ? 'EMP-ADMIN' : 'EMP-001');
    const mockName = (req.headers['x-mock-name'] as string) || (mockRole === 'ADMIN' ? 'Alex Rivera (HR Lead)' : 'Sarah Connor (Software Engineer)');
    const mockEmail = (req.headers['x-mock-email'] as string) || (mockRole === 'ADMIN' ? 'admin@dayflow.com' : 'sarah@dayflow.com');

    req.user = {
      id: mockId,
      email: mockEmail,
      role: mockRole === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
      employee_id: mockEmployeeId,
      name: mockName,
    };
    return next();
  }

  // 3. Unauthorized when no header and dev mode disabled
  res.status(401).json({
    success: false,
    message: 'Access denied. Bearer JWT authorization token is missing.',
  });
};

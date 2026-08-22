import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken, TokenPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyJwtToken(token);
      req.user = decoded;
      return next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
      return;
    }
  }

  // Fallback for dev / integration mock headers if present
  const mockRole = req.headers['x-mock-role'] as 'ADMIN' | 'EMPLOYEE' | undefined;
  const mockEmployeeId = req.headers['x-mock-employee-id'] as string | undefined;
  const mockUserId = req.headers['x-mock-user-id'] as string | undefined;
  const mockName = req.headers['x-mock-name'] as string | undefined;
  const mockEmail = req.headers['x-mock-email'] as string | undefined;

  if (mockRole || mockEmployeeId) {
    req.user = {
      id: mockUserId || 'usr_mock_001',
      email: mockEmail || (mockRole === 'ADMIN' ? 'admin@dayflow.com' : 'employee@dayflow.com'),
      role: mockRole || 'ADMIN',
      employee_id: mockEmployeeId || 'EMP-001',
      name: mockName || (mockRole === 'ADMIN' ? 'Admin User' : 'Sarah Connor'),
    };
    return next();
  }

  res.status(401).json({
    success: false,
    message: 'Access denied. Authorization header with Bearer token is missing.',
  });
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyJwtToken(token);
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

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


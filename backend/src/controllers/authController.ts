import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { EmployeeService } from '../services/employeeService';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { signupSchema, loginSchema } from '../validators/schemas';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = signupSchema.parse(req.body);

    const existingUser = await UserService.findByEmail(validated.email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists. Please login instead.',
      });
      return;
    }

    const hashedPassword = await hashPassword(validated.password);

    // Auto-create or associate an Employee record
    const employeeId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await EmployeeService.createEmployee({
        employee_id: employeeId,
        name: validated.name,
        email: validated.email,
        designation: validated.role === 'ADMIN' ? 'HR Administrator' : 'Software Engineer',
        department: validated.role === 'ADMIN' ? 'Human Resources' : 'Engineering',
        joining_date: new Date(),
        salary: validated.role === 'ADMIN' ? 85000 : 65000,
      });
    } catch (e) {
      // Continue if employee record exists
    }

    const newUser = await UserService.createUser({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
      employee_id: employeeId,
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      employee_id: newUser.employee_id || employeeId,
      name: newUser.name,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        employee_id: newUser.employee_id || employeeId,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await UserService.findByEmail(validated.email);
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isPasswordValid = await comparePassword(validated.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Resolve employee_id if not present on user
    let employeeId = user.employee_id;
    if (!employeeId) {
      const emp = await EmployeeService.getEmployeeByEmail(user.email);
      employeeId = emp?.employee_id || `EMP-${user.id.substring(0, 4).toUpperCase()}`;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      employee_id: employeeId,
      name: user.name,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        employee_id: employeeId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated' });
      return;
    }

    const user = await UserService.findById(req.user.id);
    let employeeId = user?.employee_id || req.user.employee_id;

    if (!employeeId && user?.email) {
      const emp = await EmployeeService.getEmployeeByEmail(user.email);
      employeeId = emp?.employee_id;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user?.id || req.user.id,
        name: user?.name || req.user.name || 'User',
        email: user?.email || req.user.email,
        role: user?.role || req.user.role,
        employee_id: employeeId || 'EMP001',
        createdAt: user?.createdAt || new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};


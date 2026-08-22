import { Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employeeService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { createEmployeeSchema, updateEmployeeSchema, updateOwnProfileSchema } from '../validators/schemas';

export const getEmployees = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const department = req.query.department as string;
    const designation = req.query.designation as string;

    const result = await EmployeeService.getEmployees({
      page,
      limit,
      search,
      department,
      designation,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    // Security check: Employee can only view their own full profile unless they are ADMIN
    if (req.user?.role !== 'ADMIN' && req.user?.employee_id !== employeeId) {
      res.status(403).json({ success: false, message: 'Forbidden: Access restricted to own profile or Admin.' });
      return;
    }

    const employee = await EmployeeService.getEmployeeById(employeeId);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createEmployeeSchema.parse(req.body);
    const employee = await EmployeeService.createEmployee(validated);
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const validated = updateEmployeeSchema.parse(req.body);
    const updated = await EmployeeService.updateEmployee(employeeId, validated);
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOwnProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    // Security check: Employee can only update own profile
    if (req.user?.employee_id !== employeeId && req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own profile details.',
      });
      return;
    }

    const validated = updateOwnProfileSchema.parse(req.body);
    const updated = await EmployeeService.updateOwnProfile(employeeId, validated);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    // Security check
    if (req.user?.role !== 'ADMIN' && req.user?.employee_id !== employeeId) {
      res.status(403).json({ success: false, message: 'Forbidden: Unauthorized profile picture update.' });
      return;
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    const updated = await EmployeeService.uploadProfilePicture(employeeId, fileUrl);

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { profile_picture: updated.profile_picture },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    await EmployeeService.deleteEmployee(employeeId);
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeStats = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await EmployeeService.getEmployeeStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};


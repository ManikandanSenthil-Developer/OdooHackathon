import { Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const getEmployeeIdFromReq = (req: AuthenticatedRequest): string => {
  return req.user?.employee_id || req.user?.id || 'EMP001';
};

export const checkIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = getEmployeeIdFromReq(req);
    const attendance = await AttendanceService.checkIn(employeeId);
    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = getEmployeeIdFromReq(req);
    const attendance = await AttendanceService.checkOut(employeeId);
    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = getEmployeeIdFromReq(req);
    const attendance = await AttendanceService.findTodayAttendance(employeeId);
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = getEmployeeIdFromReq(req);
    const attendance = await AttendanceService.getWeeklyAttendance(employeeId);
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;

    const attendance = await AttendanceService.getAllAttendance({ employeeId, date });
    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};


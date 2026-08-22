import { Response } from 'express';
import { AttendanceStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../prisma/client';

// Attendance dates are stored at the start of the local calendar day.
const getDayBounds = (value = new Date()): { start: Date; end: Date } => {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const findTodayAttendance = (employeeId: string) => {
  const { start, end } = getDayBounds();

  return prisma.attendance.findFirst({
    where: { employeeId, date: { gte: start, lt: end } },
  });
};

const getEmployeeId = async (req: AuthenticatedRequest): Promise<string> => {
  if (req.user?.id) return req.user.id;

  // The standalone schema is merged with the authenticated User schema in the host app.
  const employee = await (prisma as typeof prisma & {
    user: {
      findUnique: (args: {
        where: { email: string };
        select: { id: true };
      }) => Promise<{ id: string } | null>;
    };
  }).user.findUnique({
    where: { email: "employee@dayflow.com" },
    select: { id: true },
  });

  if (!employee) {
    throw new Error("Demo employee not found.");
  }

  return employee.id;
};

/** POST /api/attendance/check-in */
export const checkIn = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId = await getEmployeeId(req);
    const existingAttendance = await findTodayAttendance(employeeId);

    if (existingAttendance) {
      res.status(400).json({
        success: false,
        message: 'Attendance already exists for today.',
      });
      return;
    }

    const now = new Date();
    console.log("Resolved employee:", employeeId);
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: getDayBounds(now).start,
        checkIn: now,
        status: AttendanceStatus.PRESENT,
      },
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to check in.',
      error: error.message,
    });
  }
};

/** POST /api/attendance/check-out */
export const checkOut = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId = await getEmployeeId(req);
    const attendance = await findTodayAttendance(employeeId);

    if (!attendance?.checkIn) {
      res.status(400).json({
        success: false,
        message: 'Check in before checking out.',
      });
      return;
    }

    if (attendance.checkOut) {
      res.status(400).json({
        success: false,
        message: 'Attendance has already been checked out.',
      });
      return;
    }

    const checkOutTime = new Date();
    const workingHours =
      (checkOutTime.getTime() - attendance.checkIn.getTime()) / 3_600_000;

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: checkOutTime, workingHours: Math.max(0, workingHours) },
    });

    res.status(200).json({ success: true, data: updatedAttendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to check out.',
      error: error.message,
    });
  }
};

/** GET /api/attendance/today */
export const getTodayAttendance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId = await getEmployeeId(req);
    const attendance = await findTodayAttendance(employeeId);
    res.status(200).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's attendance.",
      error: error.message,
    });
  }
};

/** GET /api/attendance/week - returns today and the previous six days. */
export const getWeeklyAttendance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId = await getEmployeeId(req);
    const { start: todayStart, end: tomorrowStart } = getDayBounds();
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: weekStart, lt: tomorrowStart },
      },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly attendance.',
      error: error.message,
    });
  }
};

/** GET /api/attendance/all - admin-only attendance listing with filters. */
export const getAllAttendance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId =
      typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    const dateValue = typeof req.query.date === 'string' ? req.query.date : undefined;

    let dateFilter: { start: Date; end: Date } | undefined;
    if (dateValue) {
      const parsedDate = new Date(`${dateValue}T00:00:00`);
      if (Number.isNaN(parsedDate.getTime())) {
        res.status(400).json({ success: false, message: 'Invalid date filter.' });
        return;
      }
      dateFilter = getDayBounds(parsedDate);
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: dateFilter
          ? { gte: dateFilter.start, lt: dateFilter.end }
          : undefined,
      },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records.',
      error: error.message,
    });
  }
};
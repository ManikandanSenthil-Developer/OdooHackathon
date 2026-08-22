import { AttendanceStatus } from '@prisma/client';
import { prisma } from '../prisma/client';
import { getDayBounds } from '../utils/dateUtils';

interface MemAttendance {
  id: number;
  employeeId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: AttendanceStatus;
  workingHours: number;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    employee_id: string;
    name: string;
    email: string;
    department: string;
  };
}

let memAttendanceRecords: MemAttendance[] = [
  {
    id: 1,
    employeeId: 'EMP001',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    checkIn: new Date(new Date().setHours(9, 0, 0, 0)),
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workingHours: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    employee: {
      employee_id: 'EMP001',
      name: 'Sarah Connor',
      email: 'employee@dayflow.com',
      department: 'Engineering',
    },
  },
  {
    id: 2,
    employeeId: 'EMP001',
    date: new Date(Date.now() - 1 * 86400000),
    checkIn: new Date(Date.now() - 1 * 86400000 + 9 * 3600000),
    checkOut: new Date(Date.now() - 1 * 86400000 + 17.5 * 3600000),
    status: AttendanceStatus.PRESENT,
    workingHours: 8.5,
    createdAt: new Date(Date.now() - 1 * 86400000),
    updatedAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: 3,
    employeeId: 'EMP002',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    checkIn: new Date(new Date().setHours(8, 55, 0, 0)),
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workingHours: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    employee: {
      employee_id: 'EMP002',
      name: 'Michael Scott',
      email: 'michael@dayflow.com',
      department: 'Management',
    },
  },
];

let nextAttendanceId = 10;

export class AttendanceService {
  static async findTodayAttendance(employeeId: string) {
    const { start, end } = getDayBounds();

    try {
      return await prisma.attendance.findFirst({
        where: {
          employeeId,
          date: { gte: start, lt: end },
        },
        include: { employee: true },
      });
    } catch {
      return (
        memAttendanceRecords.find(
          (a) =>
            a.employeeId === employeeId &&
            a.date.getTime() >= start.getTime() &&
            a.date.getTime() < end.getTime()
        ) || null
      );
    }
  }

  static async checkIn(employeeId: string) {
    const existing = await this.findTodayAttendance(employeeId);
    if (existing) {
      throw { statusCode: 400, message: 'Attendance already logged for today.' };
    }

    const now = new Date();
    const dayStart = getDayBounds(now).start;

    try {
      const record = await prisma.attendance.create({
        data: {
          employeeId,
          date: dayStart,
          checkIn: now,
          status: AttendanceStatus.PRESENT,
        },
        include: { employee: true },
      });
      return record;
    } catch {
      const newRec: MemAttendance = {
        id: nextAttendanceId++,
        employeeId,
        date: dayStart,
        checkIn: now,
        checkOut: null,
        status: AttendanceStatus.PRESENT,
        workingHours: 0,
        createdAt: now,
        updatedAt: now,
      };
      memAttendanceRecords.unshift(newRec);
      return newRec;
    }
  }

  static async checkOut(employeeId: string) {
    const record = await this.findTodayAttendance(employeeId);

    if (!record || !record.checkIn) {
      throw { statusCode: 400, message: 'Must check in before checking out.' };
    }

    if (record.checkOut) {
      throw { statusCode: 400, message: 'Already checked out for today.' };
    }

    const now = new Date();
    const workingHours = Math.max(
      0,
      Math.round(((now.getTime() - new Date(record.checkIn).getTime()) / 3600000) * 100) / 100
    );

    try {
      const updated = await prisma.attendance.update({
        where: { id: record.id },
        data: {
          checkOut: now,
          workingHours,
        },
        include: { employee: true },
      });
      return updated;
    } catch {
      const rec = memAttendanceRecords.find((a) => a.id === record.id);
      if (rec) {
        rec.checkOut = now;
        rec.workingHours = workingHours;
        rec.updatedAt = now;
        return rec;
      }
      return record;
    }
  }

  static async getWeeklyAttendance(employeeId: string) {
    const { start: todayStart, end: tomorrowStart } = getDayBounds();
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    try {
      return await prisma.attendance.findMany({
        where: {
          employeeId,
          date: { gte: weekStart, lt: tomorrowStart },
        },
        orderBy: { date: 'desc' },
        include: { employee: true },
      });
    } catch {
      return memAttendanceRecords
        .filter(
          (a) =>
            a.employeeId === employeeId &&
            a.date.getTime() >= weekStart.getTime() &&
            a.date.getTime() < tomorrowStart.getTime()
        )
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  }

  static async getAllAttendance(filters: { employeeId?: string; date?: string }) {
    let dateFilter: { start: Date; end: Date } | undefined;
    if (filters.date) {
      const parsedDate = new Date(`${filters.date}T00:00:00`);
      if (!isNaN(parsedDate.getTime())) {
        dateFilter = getDayBounds(parsedDate);
      }
    }

    try {
      return await prisma.attendance.findMany({
        where: {
          ...(filters.employeeId && { employeeId: filters.employeeId }),
          ...(dateFilter && { date: { gte: dateFilter.start, lt: dateFilter.end } }),
        },
        orderBy: { date: 'desc' },
        include: { employee: true },
      });
    } catch {
      return memAttendanceRecords
        .filter((a) => {
          if (filters.employeeId && a.employeeId !== filters.employeeId) return false;
          if (dateFilter) {
            const time = a.date.getTime();
            if (time < dateFilter.start.getTime() || time >= dateFilter.end.getTime()) return false;
          }
          return true;
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  }
}


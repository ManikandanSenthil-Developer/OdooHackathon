export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALFDAY' | 'LEAVE';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number;
  status: AttendanceStatus;
  employee?: {
    name: string;
    department: string;
    designation: string;
  };
}

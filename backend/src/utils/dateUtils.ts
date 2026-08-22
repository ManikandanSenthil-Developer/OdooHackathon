/**
 * Date Utility Functions for Dayflow HRMS
 */

export const parseDateOrThrow = (dateInput: string | Date, fieldName = 'Date'): Date => {
  const parsed = new Date(dateInput);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date provided for ${fieldName}: ${dateInput}`);
  }
  return parsed;
};

export const calculateTotalDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (start.getTime() > end.getTime()) {
    throw new Error('Start date cannot be after end date.');
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of both start and end days

  return diffDays;
};

export const getDayBounds = (value = new Date()): { start: Date; end: Date } => {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};


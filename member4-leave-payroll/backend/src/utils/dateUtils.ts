/**
 * Calculate total calendar days between two dates inclusive.
 * Total days = (End Date - Start Date in days) + 1
 */
export function calculateTotalDays(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) {
    throw new Error('Start date cannot be after end date');
  }

  const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, days);
}

/**
 * Validate that a date string is valid ISO YYYY-MM-DD or standard parseable date.
 */
export function parseDateOrThrow(dateStr: string, fieldName: string): Date {
  if (!dateStr) {
    throw new Error(`${fieldName} is required`);
  }
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date format for ${fieldName}`);
  }
  return parsed;
}

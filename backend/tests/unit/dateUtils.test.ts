import { calculateTotalDays, parseDateOrThrow, getDayBounds } from '../../src/utils/dateUtils';

describe('Date Utilities Unit Tests', () => {
  describe('calculateTotalDays', () => {
    test('should calculate 1 day for same start and end date', () => {
      const date = new Date('2026-08-25');
      const days = calculateTotalDays(date, date);
      expect(days).toBe(1);
    });

    test('should calculate inclusive days for multi-day date range', () => {
      const start = new Date('2026-08-25');
      const end = new Date('2026-08-27');
      const days = calculateTotalDays(start, end);
      expect(days).toBe(3); // Aug 25, 26, 27
    });

    test('should throw error when start date is after end date', () => {
      const start = new Date('2026-08-28');
      const end = new Date('2026-08-25');
      expect(() => calculateTotalDays(start, end)).toThrow('Start date cannot be after end date');
    });
  });

  describe('parseDateOrThrow', () => {
    test('should parse valid ISO date strings', () => {
      const parsed = parseDateOrThrow('2026-08-25');
      expect(parsed).toBeInstanceOf(Date);
      expect(isNaN(parsed.getTime())).toBe(false);
    });

    test('should throw descriptive error for invalid date strings', () => {
      expect(() => parseDateOrThrow('not-a-date', 'Start Date')).toThrow(
        'Invalid date provided for Start Date'
      );
    });
  });

  describe('getDayBounds', () => {
    test('should return start of day (00:00:00) and next day start (00:00:00)', () => {
      const date = new Date('2026-08-25T14:35:00');
      const { start, end } = getDayBounds(date);

      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);

      const diffMs = end.getTime() - start.getTime();
      expect(diffMs).toBe(24 * 60 * 60 * 1000); // exactly 24 hours
    });
  });
});


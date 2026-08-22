import { calculateNetSalary, formatCurrency } from '../../src/utils/salaryCalculator';

describe('Salary Calculator Unit Tests', () => {
  describe('calculateNetSalary', () => {
    test('should correctly compute net salary for valid standard figures', () => {
      const result = calculateNetSalary(50000, 10000, 4000);
      expect(result.isValid).toBe(true);
      expect(result.netSalary).toBe(56000);
      expect(result.error).toBeUndefined();
    });

    test('should correctly compute when allowances and deductions are zero', () => {
      const result = calculateNetSalary(45000, 0, 0);
      expect(result.isValid).toBe(true);
      expect(result.netSalary).toBe(45000);
    });

    test('should reject negative basic salary', () => {
      const result = calculateNetSalary(-5000, 1000, 500);
      expect(result.isValid).toBe(false);
      expect(result.netSalary).toBe(0);
      expect(result.error).toContain('Basic salary must be a non-negative number');
    });

    test('should reject negative allowances', () => {
      const result = calculateNetSalary(50000, -1000, 500);
      expect(result.isValid).toBe(false);
      expect(result.netSalary).toBe(0);
      expect(result.error).toContain('Allowances must be a non-negative number');
    });

    test('should reject negative deductions', () => {
      const result = calculateNetSalary(50000, 1000, -500);
      expect(result.isValid).toBe(false);
      expect(result.netSalary).toBe(0);
      expect(result.error).toContain('Deductions must be a non-negative number');
    });

    test('should reject when deductions exceed gross earnings', () => {
      const result = calculateNetSalary(3000, 500, 4000);
      expect(result.isValid).toBe(false);
      expect(result.netSalary).toBe(0);
      expect(result.error).toContain('cannot exceed gross earnings');
    });

    test('should handle decimal values properly without floating point inaccuracies', () => {
      const result = calculateNetSalary(5432.10, 1234.50, 678.90);
      expect(result.isValid).toBe(true);
      expect(result.netSalary).toBe(5987.70);
    });
  });

  describe('formatCurrency', () => {
    test('should format numeric values as USD currency', () => {
      expect(formatCurrency(56000)).toBe('$56,000.00');
      expect(formatCurrency(1234.5)).toBe('$1,234.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('should handle string numeric representations', () => {
      expect(formatCurrency('75000')).toBe('$75,000.00');
    });

    test('should return fallback for NaN inputs', () => {
      expect(formatCurrency('invalid')).toBe('$0.00');
    });
  });
});


/**
 * Calculate Net Salary and validate financial non-negativity.
 * Net Salary = Basic Salary + Allowances - Deductions
 */
export function calculateNetSalary(
  basic: number,
  allowances: number,
  deductions: number
): { netSalary: number; isValid: boolean; error?: string } {
  if (isNaN(basic) || basic < 0) {
    return { netSalary: 0, isValid: false, error: 'Basic salary cannot be negative or invalid' };
  }
  if (isNaN(allowances) || allowances < 0) {
    return { netSalary: 0, isValid: false, error: 'Allowances cannot be negative or invalid' };
  }
  if (isNaN(deductions) || deductions < 0) {
    return { netSalary: 0, isValid: false, error: 'Deductions cannot be negative or invalid' };
  }

  const netSalary = Math.round((basic + allowances - deductions) * 100) / 100;
  if (netSalary < 0) {
    return { netSalary: 0, isValid: false, error: 'Net salary cannot be negative (Deductions exceed earnings)' };
  }

  return { netSalary, isValid: true };
}

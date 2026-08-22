/**
 * Salary Calculation Engine for Dayflow HRMS
 */

export interface SalaryCalculationResult {
  netSalary: number;
  isValid: boolean;
  error?: string;
}

export const calculateNetSalary = (
  basicSalary: number,
  totalAllowances: number,
  totalDeductions: number
): SalaryCalculationResult => {
  const basic = Number(basicSalary);
  const allowances = Number(totalAllowances);
  const deductions = Number(totalDeductions);

  if (isNaN(basic) || basic < 0) {
    return { netSalary: 0, isValid: false, error: 'Basic salary must be a non-negative number.' };
  }

  if (isNaN(allowances) || allowances < 0) {
    return { netSalary: 0, isValid: false, error: 'Allowances must be a non-negative number.' };
  }

  if (isNaN(deductions) || deductions < 0) {
    return { netSalary: 0, isValid: false, error: 'Deductions must be a non-negative number.' };
  }

  const grossEarnings = basic + allowances;
  const netSalary = Math.round((grossEarnings - deductions) * 100) / 100;

  if (netSalary < 0) {
    return {
      netSalary: 0,
      isValid: false,
      error: `Total deductions ($${deductions}) cannot exceed gross earnings ($${grossEarnings}).`,
    };
  }

  return {
    netSalary,
    isValid: true,
  };
};

export const formatCurrency = (amount: number | string): string => {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(numeric);
};


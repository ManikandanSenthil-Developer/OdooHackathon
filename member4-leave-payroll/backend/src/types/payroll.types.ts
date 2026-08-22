export interface UpdateSalaryDto {
  basic_salary: number;
  total_allowances: number;
  total_deductions: number;
  effective_from?: string;
  payment_status?: string;
  pay_cycle?: string;
}

export interface PayrollFilterQuery {
  search?: string;
  department?: string;
}

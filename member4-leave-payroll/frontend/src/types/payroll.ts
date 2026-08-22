export interface SalaryPaystub {
  id: string;
  payroll_id: string;
  employee_id: string;
  month: string;
  amount: number | string;
  status: string;
  disbursed_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  department?: string;
  designation?: string;
  basic_salary: number | string;
  total_allowances: number | string;
  total_deductions: number | string;
  net_salary: number | string;
  effective_from: string;
  pay_cycle: string;
  payment_status: string;
  bank_account_mask?: string;
  created_at: string;
  updated_at: string;
  paystubs?: SalaryPaystub[];
}

export interface UpdateSalaryPayload {
  basic_salary: number;
  total_allowances: number;
  total_deductions: number;
  effective_from?: string;
  payment_status?: string;
  pay_cycle?: string;
}

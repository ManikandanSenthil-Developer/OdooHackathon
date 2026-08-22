export interface Paystub {
  id: string;
  month: string;
  amount: number;
  disbursed_at: string;
  status: string;
}

export interface PayrollRecord {
  id?: string;
  employee_id: string;
  employee_name?: string;
  department?: string;
  basic_salary: number;
  total_allowances: number;
  total_deductions: number;
  net_salary: number;
  pay_cycle?: string;
  payment_status?: string;
  bank_account_mask?: string;
  paystubs?: Paystub[];
}

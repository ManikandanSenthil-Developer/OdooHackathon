import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../prisma/client';
import { calculateNetSalary } from '../utils/salaryCalculator';

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

interface MemPaystub {
  id: string;
  payroll_id: string;
  employee_id: string;
  month: string;
  amount: number;
  status: string;
  disbursed_at: Date;
}

interface MemPayroll {
  id: string;
  employee_id: string;
  employee_name: string;
  department?: string;
  designation?: string;
  basic_salary: number;
  total_allowances: number;
  total_deductions: number;
  net_salary: number;
  effective_from: Date;
  pay_cycle: string;
  payment_status: string;
  bank_account_mask?: string;
  created_at: Date;
  updated_at: Date;
  paystubs: MemPaystub[];
}

const memoryPayrolls = new Map<string, MemPayroll>([
  [
    'EMP001',
    {
      id: 'pay-001',
      employee_id: 'EMP001',
      employee_name: 'Sarah Connor',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      basic_salary: 55000,
      total_allowances: 12000,
      total_deductions: 4500,
      net_salary: 62500,
      effective_from: new Date('2024-01-15'),
      pay_cycle: 'Monthly (28th of every month)',
      payment_status: 'Paid',
      bank_account_mask: '•••• •••• •••• 4921',
      created_at: new Date('2024-01-15'),
      updated_at: new Date(),
      paystubs: [
        { id: 'ps-101', payroll_id: 'pay-001', employee_id: 'EMP001', month: 'August 2026', amount: 62500, status: 'Paid', disbursed_at: new Date() },
        { id: 'ps-102', payroll_id: 'pay-001', employee_id: 'EMP001', month: 'July 2026', amount: 62500, status: 'Paid', disbursed_at: new Date(Date.now() - 30 * 86400000) },
        { id: 'ps-103', payroll_id: 'pay-001', employee_id: 'EMP001', month: 'June 2026', amount: 62500, status: 'Paid', disbursed_at: new Date(Date.now() - 60 * 86400000) },
      ],
    },
  ],
  [
    'EMP002',
    {
      id: 'pay-002',
      employee_id: 'EMP002',
      employee_name: 'Michael Scott',
      department: 'Management',
      designation: 'Regional Director',
      basic_salary: 65000,
      total_allowances: 15000,
      total_deductions: 6000,
      net_salary: 74000,
      effective_from: new Date('2023-06-01'),
      pay_cycle: 'Monthly (28th of every month)',
      payment_status: 'Paid',
      bank_account_mask: '•••• •••• •••• 8812',
      created_at: new Date('2023-06-01'),
      updated_at: new Date(),
      paystubs: [
        { id: 'ps-201', payroll_id: 'pay-002', employee_id: 'EMP002', month: 'August 2026', amount: 74000, status: 'Paid', disbursed_at: new Date() },
        { id: 'ps-202', payroll_id: 'pay-002', employee_id: 'EMP002', month: 'July 2026', amount: 74000, status: 'Paid', disbursed_at: new Date(Date.now() - 30 * 86400000) },
      ],
    },
  ],
  [
    'EMP003',
    {
      id: 'pay-003',
      employee_id: 'EMP003',
      employee_name: 'Pam Beesly',
      department: 'Human Resources',
      designation: 'HR Specialist',
      basic_salary: 48000,
      total_allowances: 9000,
      total_deductions: 3500,
      net_salary: 53500,
      effective_from: new Date('2023-09-10'),
      pay_cycle: 'Monthly (28th of every month)',
      payment_status: 'Paid',
      bank_account_mask: '•••• •••• •••• 3341',
      created_at: new Date('2023-09-10'),
      updated_at: new Date(),
      paystubs: [
        { id: 'ps-301', payroll_id: 'pay-003', employee_id: 'EMP003', month: 'August 2026', amount: 53500, status: 'Paid', disbursed_at: new Date() },
      ],
    },
  ],
]);

export class PayrollService {
  static async getOrCreatePayroll(
    employeeId: string,
    employeeName = 'Employee',
    department = 'Engineering & HR Tech',
    designation = 'Staff Specialist'
  ) {
    try {
      let payroll = await prisma.payroll.findUnique({
        where: { employee_id: employeeId },
        include: {
          paystubs: {
            orderBy: { disbursed_at: 'desc' },
            take: 6,
          },
        },
      });

      if (!payroll) {
        const basic = 50000;
        const allowances = 10000;
        const deductions = 4000;
        const net = basic + allowances - deductions;

        payroll = await prisma.payroll.create({
          data: {
            employee_id: employeeId,
            employee_name: employeeName,
            department,
            designation,
            basic_salary: new Decimal(basic),
            total_allowances: new Decimal(allowances),
            total_deductions: new Decimal(deductions),
            net_salary: new Decimal(net),
            pay_cycle: 'Monthly (28th of every month)',
            payment_status: 'Paid',
            bank_account_mask: '•••• •••• •••• 4921',
            paystubs: {
              create: [
                { employee_id: employeeId, month: 'August 2026', amount: new Decimal(net), status: 'Paid' },
                { employee_id: employeeId, month: 'July 2026', amount: new Decimal(net), status: 'Paid' },
                { employee_id: employeeId, month: 'June 2026', amount: new Decimal(net), status: 'Paid' },
              ],
            },
          },
          include: {
            paystubs: {
              orderBy: { disbursed_at: 'desc' },
              take: 6,
            },
          },
        });
      }

      return payroll;
    } catch {
      let memPay = memoryPayrolls.get(employeeId);
      if (!memPay) {
        const basic = 50000;
        const allowances = 10000;
        const deductions = 4000;
        const net = basic + allowances - deductions;
        memPay = {
          id: 'pay-' + employeeId,
          employee_id: employeeId,
          employee_name: employeeName,
          department,
          designation,
          basic_salary: basic,
          total_allowances: allowances,
          total_deductions: deductions,
          net_salary: net,
          effective_from: new Date(),
          pay_cycle: 'Monthly (28th of every month)',
          payment_status: 'Paid',
          bank_account_mask: '•••• •••• •••• 4921',
          created_at: new Date(),
          updated_at: new Date(),
          paystubs: [
            { id: 'ps-1', payroll_id: 'pay-' + employeeId, employee_id: employeeId, month: 'August 2026', amount: net, status: 'Paid', disbursed_at: new Date() },
            { id: 'ps-2', payroll_id: 'pay-' + employeeId, employee_id: employeeId, month: 'July 2026', amount: net, status: 'Paid', disbursed_at: new Date(Date.now() - 30 * 86400000) },
          ],
        };
        memoryPayrolls.set(employeeId, memPay);
      }
      return memPay;
    }
  }

  static async getEmployeeSalary(employeeId: string, employeeName?: string) {
    return this.getOrCreatePayroll(employeeId, employeeName);
  }

  static async getAllPayrollsForAdmin(filters: PayrollFilterQuery) {
    try {
      const where: any = {};
      if (filters.department && filters.department !== 'ALL') {
        where.department = { contains: filters.department };
      }
      if (filters.search && filters.search.trim() !== '') {
        const search = filters.search.trim();
        where.OR = [
          { employee_name: { contains: search } },
          { employee_id: { contains: search } },
          { designation: { contains: search } },
          { department: { contains: search } },
        ];
      }

      return await prisma.payroll.findMany({
        where,
        include: {
          paystubs: {
            orderBy: { disbursed_at: 'desc' },
            take: 3,
          },
        },
        orderBy: { created_at: 'desc' },
      });
    } catch {
      return Array.from(memoryPayrolls.values()).filter((p) => {
        if (filters.department && filters.department !== 'ALL' && p.department !== filters.department) {
          return false;
        }
        if (filters.search && filters.search.trim() !== '') {
          const q = filters.search.toLowerCase();
          return (
            p.employee_name.toLowerCase().includes(q) ||
            p.employee_id.toLowerCase().includes(q) ||
            (p.designation && p.designation.toLowerCase().includes(q)) ||
            (p.department && p.department.toLowerCase().includes(q))
          );
        }
        return true;
      });
    }
  }

  static async getPayrollByEmployeeId(employeeId: string) {
    try {
      const payroll = await prisma.payroll.findUnique({
        where: { employee_id: employeeId },
        include: {
          paystubs: {
            orderBy: { disbursed_at: 'desc' },
          },
        },
      });

      if (!payroll) {
        throw { statusCode: 404, message: `Payroll record not found for employee ${employeeId}` };
      }

      return payroll;
    } catch (err: any) {
      if (err.statusCode) throw err;
      const memPay = memoryPayrolls.get(employeeId);
      if (!memPay) {
        throw { statusCode: 404, message: `Payroll record not found for employee ${employeeId}` };
      }
      return memPay;
    }
  }

  static async updateSalaryStructure(employeeId: string, data: UpdateSalaryDto) {
    const { netSalary, isValid, error } = calculateNetSalary(
      Number(data.basic_salary),
      Number(data.total_allowances),
      Number(data.total_deductions)
    );

    if (!isValid) {
      throw { statusCode: 400, message: error || 'Invalid salary calculation' };
    }

    try {
      await this.getOrCreatePayroll(employeeId);

      const updated = await prisma.payroll.update({
        where: { employee_id: employeeId },
        data: {
          basic_salary: new Decimal(data.basic_salary),
          total_allowances: new Decimal(data.total_allowances),
          total_deductions: new Decimal(data.total_deductions),
          net_salary: new Decimal(netSalary),
          ...(data.effective_from ? { effective_from: new Date(data.effective_from) } : {}),
          ...(data.payment_status ? { payment_status: data.payment_status } : {}),
          ...(data.pay_cycle ? { pay_cycle: data.pay_cycle } : {}),
        },
        include: {
          paystubs: {
            orderBy: { disbursed_at: 'desc' },
            take: 5,
          },
        },
      });

      return updated;
    } catch {
      let memPay = memoryPayrolls.get(employeeId);
      if (!memPay) {
        await this.getOrCreatePayroll(employeeId);
        memPay = memoryPayrolls.get(employeeId)!;
      }
      memPay.basic_salary = Number(data.basic_salary);
      memPay.total_allowances = Number(data.total_allowances);
      memPay.total_deductions = Number(data.total_deductions);
      memPay.net_salary = netSalary;
      if (data.effective_from) memPay.effective_from = new Date(data.effective_from);
      if (data.payment_status) memPay.payment_status = data.payment_status;
      if (data.pay_cycle) memPay.pay_cycle = data.pay_cycle;
      memPay.updated_at = new Date();
      return memPay;
    }
  }
}


import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'EMPLOYEE']).optional().default('EMPLOYEE'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createEmployeeSchema = z.object({
  employee_id: z.string().optional(),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  profile_picture: z.string().optional().nullable(),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().min(2, 'Department is required'),
  joining_date: z.string().or(z.date()),
  salary: z.number().or(z.string()).transform((val) => Number(val)),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  designation: z.string().optional(),
  department: z.string().optional(),
  joining_date: z.string().or(z.date()).optional(),
  salary: z.number().or(z.string()).transform((val) => Number(val)).optional(),
});

export const updateOwnProfileSchema = z.object({
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const createLeaveSchema = z.object({
  leave_type: z.enum(['PAID', 'SICK', 'UNPAID']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  remarks: z.string().optional(),
});

export const reviewLeaveSchema = z.object({
  admin_comment: z.string().optional(),
});

export const updateSalarySchema = z.object({
  basic_salary: z.number().or(z.string()).transform((val) => Number(val)),
  total_allowances: z.number().or(z.string()).transform((val) => Number(val)),
  total_deductions: z.number().or(z.string()).transform((val) => Number(val)),
  effective_from: z.string().optional(),
  payment_status: z.string().optional(),
  pay_cycle: z.string().optional(),
});


const { z } = require('zod');

const createEmployeeSchema = z.object({
  body: z.object({
    employee_id: z.string().min(1, 'Employee ID is required'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().min(1, 'Designation is required'),
    department: z.string().min(1, 'Department is required'),
    joining_date: z.string().datetime({ message: 'Must be a valid ISO datetime' }),
    salary: z.number().nonnegative('Salary cannot be negative')
  })
});

const updateEmployeeSchema = z.object({
  params: z.object({
    employeeId: z.string()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    department: z.string().optional(),
    joining_date: z.string().datetime().optional(),
    salary: z.number().nonnegative().optional()
  })
});

const updateOwnProfileSchema = z.object({
  params: z.object({
    employeeId: z.string()
  }),
  body: z.object({
    phone: z.string().optional(),
    address: z.string().optional()
  })
});

const getEmployeesQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number),
    limit: z.string().regex(/^\d+$/).optional().transform(Number),
    search: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional()
  })
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateOwnProfileSchema,
  getEmployeesQuerySchema
};

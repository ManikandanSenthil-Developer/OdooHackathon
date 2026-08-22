import { PrismaClient, Role, AttendanceStatus, LeaveType, LeaveStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dayflow HRMS Database Seeding...');

  // 1. Password Hashes
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const employeePasswordHash = await bcrypt.hash('Employee@123', 10);

  // 2. Employees Seeding
  const employeesData = [
    {
      employee_id: 'EMP000',
      name: 'Alex Rivera',
      email: 'admin@dayflow.com',
      phone: '+1 (555) 123-4567',
      address: '500 Tech Parkway, Suite 400, San Francisco, CA',
      designation: 'HR Director',
      department: 'Human Resources',
      joining_date: new Date('2023-01-10'),
      salary: 95000,
    },
    {
      employee_id: 'EMP001',
      name: 'Sarah Connor',
      email: 'employee@dayflow.com',
      phone: '+1 (555) 234-5678',
      address: '101 Cyberdyne Way, Los Angeles, CA',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      joining_date: new Date('2024-01-15'),
      salary: 75000,
    },
    {
      employee_id: 'EMP002',
      name: 'Michael Scott',
      email: 'michael@dayflow.com',
      phone: '+1 (555) 345-6789',
      address: '1725 Slough Avenue, Scranton, PA',
      designation: 'Regional Director',
      department: 'Management',
      joining_date: new Date('2023-06-01'),
      salary: 85000,
    },
    {
      employee_id: 'EMP003',
      name: 'Pam Beesly',
      email: 'pam@dayflow.com',
      phone: '+1 (555) 456-7890',
      address: '42 Maple Street, Scranton, PA',
      designation: 'HR Specialist',
      department: 'Human Resources',
      joining_date: new Date('2023-09-10'),
      salary: 62000,
    },
    {
      employee_id: 'EMP004',
      name: 'Dwight Schrute',
      email: 'dwight@dayflow.com',
      phone: '+1 (555) 567-8901',
      address: 'Schrute Farms, Honesdale, PA',
      designation: 'Lead Sales Executive',
      department: 'Sales',
      joining_date: new Date('2023-07-20'),
      salary: 78000,
    },
  ];

  for (const emp of employeesData) {
    await prisma.employee.upsert({
      where: { employee_id: emp.employee_id },
      update: emp,
      create: emp,
    });
  }
  console.log(`✅ Seeded ${employeesData.length} Employee profiles`);

  // 3. User Accounts Seeding
  const usersData = [
    {
      name: 'Alex Rivera (Admin)',
      email: 'admin@dayflow.com',
      password: adminPasswordHash,
      role: Role.ADMIN,
      employee_id: 'EMP000',
    },
    {
      name: 'Sarah Connor',
      email: 'employee@dayflow.com',
      password: employeePasswordHash,
      role: Role.EMPLOYEE,
      employee_id: 'EMP001',
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
  console.log(`✅ Seeded ${usersData.length} User Auth credentials`);

  // 4. Leave Balances Seeding
  for (const emp of employeesData) {
    await prisma.leaveBalance.upsert({
      where: { employee_id: emp.employee_id },
      update: {},
      create: {
        employee_id: emp.employee_id,
        paid_leave_total: 18,
        paid_leave_used: 4,
        sick_leave_total: 12,
        sick_leave_used: 2,
        unpaid_leave_used: 0,
      },
    });
  }
  console.log('✅ Seeded Leave Balances');

  // 5. Sample Attendance Records
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: 'EMP001',
        date: today,
      },
    },
    update: {},
    create: {
      employeeId: 'EMP001',
      date: today,
      checkIn: new Date(new Date().setHours(9, 0, 0, 0)),
      checkOut: null,
      status: AttendanceStatus.PRESENT,
      workingHours: 0,
    },
  });

  await prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: 'EMP001',
        date: yesterday,
      },
    },
    update: {},
    create: {
      employeeId: 'EMP001',
      date: yesterday,
      checkIn: new Date(new Date(yesterday).setHours(8, 55, 0, 0)),
      checkOut: new Date(new Date(yesterday).setHours(17, 30, 0, 0)),
      status: AttendanceStatus.PRESENT,
      workingHours: 8.58,
    },
  });
  console.log('✅ Seeded Attendance logs');

  // 6. Sample Leave Requests
  await prisma.leaveRequest.createMany({
    data: [
      {
        employee_id: 'EMP001',
        employee_name: 'Sarah Connor',
        employee_email: 'employee@dayflow.com',
        leave_type: LeaveType.PAID,
        start_date: new Date(Date.now() + 4 * 86400000),
        end_date: new Date(Date.now() + 6 * 86400000),
        total_days: 3,
        remarks: 'Family vacation and personal downtime',
        status: LeaveStatus.PENDING,
      },
      {
        employee_id: 'EMP001',
        employee_name: 'Sarah Connor',
        employee_email: 'employee@dayflow.com',
        leave_type: LeaveType.SICK,
        start_date: new Date(Date.now() - 15 * 86400000),
        end_date: new Date(Date.now() - 13 * 86400000),
        total_days: 2,
        remarks: 'Doctor appointment and recovery',
        status: LeaveStatus.APPROVED,
        admin_comment: 'Approved by HR Director. Get well soon!',
        approved_by: 'Alex Rivera (Admin)',
        approved_at: new Date(Date.now() - 14 * 86400000),
      },
      {
        employee_id: 'EMP002',
        employee_name: 'Michael Scott',
        employee_email: 'michael@dayflow.com',
        leave_type: LeaveType.PAID,
        start_date: new Date(Date.now() + 8 * 86400000),
        end_date: new Date(Date.now() + 9 * 86400000),
        total_days: 2,
        remarks: 'Regional corporate seminar',
        status: LeaveStatus.PENDING,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Seeded Leave Requests');

  // 7. Sample Payroll & Paystubs
  for (const emp of employeesData) {
    const basic = emp.salary * 0.7;
    const allowances = emp.salary * 0.2;
    const deductions = emp.salary * 0.08;
    const net = basic + allowances - deductions;

    const payroll = await prisma.payroll.upsert({
      where: { employee_id: emp.employee_id },
      update: {},
      create: {
        employee_id: emp.employee_id,
        employee_name: emp.name,
        department: emp.department,
        designation: emp.designation,
        basic_salary: basic,
        total_allowances: allowances,
        total_deductions: deductions,
        net_salary: net,
        pay_cycle: 'Monthly (28th of every month)',
        payment_status: 'Paid',
        bank_account_mask: '•••• •••• •••• 4921',
      },
    });

    await prisma.salaryPaystub.createMany({
      data: [
        {
          payroll_id: payroll.id,
          employee_id: emp.employee_id,
          month: 'August 2026',
          amount: net,
          status: 'Paid',
        },
        {
          payroll_id: payroll.id,
          employee_id: emp.employee_id,
          month: 'July 2026',
          amount: net,
          status: 'Paid',
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log('✅ Seeded Payroll & Paystubs');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dayflow Module 4 demo data (Leave & Payroll)...');

  // Seed Leave Balances
  await prisma.leaveBalance.upsert({
    where: { employee_id: 'EMP-001' },
    update: {},
    create: {
      employee_id: 'EMP-001',
      paid_leave_total: 18,
      paid_leave_used: 4,
      sick_leave_total: 12,
      sick_leave_used: 2,
      unpaid_leave_used: 0,
    },
  });

  await prisma.leaveBalance.upsert({
    where: { employee_id: 'EMP-002' },
    update: {},
    create: {
      employee_id: 'EMP-002',
      paid_leave_total: 18,
      paid_leave_used: 6,
      sick_leave_total: 12,
      sick_leave_used: 1,
      unpaid_leave_used: 1,
    },
  });

  // Seed Sample Leave Requests
  const today = new Date();
  const nextWeekStart = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const nextWeekEnd = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

  const pastStart = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000);
  const pastEnd = new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000);

  await prisma.leaveRequest.createMany({
    data: [
      {
        employee_id: 'EMP-001',
        employee_name: 'Sarah Connor',
        employee_email: 'sarah@dayflow.com',
        leave_type: 'PAID',
        start_date: nextWeekStart,
        end_date: nextWeekEnd,
        total_days: 3,
        remarks: 'Family vacation and personal downtime',
        status: 'PENDING',
      },
      {
        employee_id: 'EMP-001',
        employee_name: 'Sarah Connor',
        employee_email: 'sarah@dayflow.com',
        leave_type: 'SICK',
        start_date: pastStart,
        end_date: pastEnd,
        total_days: 2,
        remarks: 'Doctor appointment and fever recovery',
        status: 'APPROVED',
        admin_comment: 'Approved. Get well soon!',
        approved_by: 'Alex Rivera (HR Lead)',
        approved_at: new Date(today.getTime() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        employee_id: 'EMP-002',
        employee_name: 'Michael Scott',
        employee_email: 'michael@dayflow.com',
        leave_type: 'PAID',
        start_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
        total_days: 2,
        remarks: 'Dunder Mifflin conference',
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  });

  // Seed Payrolls
  await prisma.payroll.upsert({
    where: { employee_id: 'EMP-001' },
    update: {},
    create: {
      employee_id: 'EMP-001',
      employee_name: 'Sarah Connor',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      basic_salary: new Decimal(55000),
      total_allowances: new Decimal(12000),
      total_deductions: new Decimal(4500),
      net_salary: new Decimal(62500),
      pay_cycle: 'Monthly (28th of every month)',
      payment_status: 'Paid',
      bank_account_mask: '•••• •••• •••• 4921',
      paystubs: {
        create: [
          { month: 'August 2026', amount: new Decimal(62500), status: 'Paid' },
          { month: 'July 2026', amount: new Decimal(62500), status: 'Paid' },
          { month: 'June 2026', amount: new Decimal(62500), status: 'Paid' },
        ],
      },
    },
  });

  await prisma.payroll.upsert({
    where: { employee_id: 'EMP-002' },
    update: {},
    create: {
      employee_id: 'EMP-002',
      employee_name: 'Michael Scott',
      department: 'Regional Management',
      designation: 'Regional Director',
      basic_salary: new Decimal(65000),
      total_allowances: new Decimal(15000),
      total_deductions: new Decimal(6000),
      net_salary: new Decimal(74000),
      pay_cycle: 'Monthly (28th of every month)',
      payment_status: 'Paid',
      bank_account_mask: '•••• •••• •••• 8812',
      paystubs: {
        create: [
          { month: 'August 2026', amount: new Decimal(74000), status: 'Paid' },
          { month: 'July 2026', amount: new Decimal(74000), status: 'Paid' },
        ],
      },
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dayflow HRMS Database...');

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const employeePassword = await bcrypt.hash('Employee@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      name: 'Sarah Connor (HR Admin)',
      email: 'admin@dayflow.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      name: 'Alex Mercer',
      email: 'employee@dayflow.com',
      password: employeePassword,
      role: 'EMPLOYEE',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('Admin:', admin.email);
  console.log('Employee:', employee.email);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const employees = [
    {
      employee_id: 'EMP001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Tech Lane',
      designation: 'Software Engineer',
      department: 'Engineering',
      joining_date: new Date('2023-01-15'),
      salary: 80000.00
    },
    {
      employee_id: 'EMP002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Product Blvd',
      designation: 'Product Manager',
      department: 'Product',
      joining_date: new Date('2022-11-01'),
      salary: 95000.00
    },
    {
      employee_id: 'EMP003',
      name: 'Alex Kumar',
      email: 'alex@example.com',
      phone: '1112223333',
      address: '789 Design Way',
      designation: 'UI/UX Designer',
      department: 'Design',
      joining_date: new Date('2023-05-10'),
      salary: 75000.00
    },
    {
      employee_id: 'EMP004',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '4445556666',
      address: '321 Quality St',
      designation: 'QA Engineer',
      department: 'Quality',
      joining_date: new Date('2023-08-20'),
      salary: 70000.00
    },
    {
      employee_id: 'EMP005',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '7778889999',
      address: '654 HR Court',
      designation: 'HR Executive',
      department: 'Human Resources',
      joining_date: new Date('2021-03-15'),
      salary: 65000.00
    }
  ];

  await prisma.$transaction(async (tx) => {
    for (const emp of employees) {
      const employee = await tx.employee.upsert({
        where: { employee_id: emp.employee_id },
        update: {},
        create: emp,
      });
      console.log(`Created employee: ${employee.name}`);

      // Seed dummy document for each employee
      await tx.document.create({
        data: {
          employee_id: employee.employee_id,
          name: 'Offer Letter',
          file_name: `${employee.employee_id}-offer-letter.pdf`,
          file_url: `/uploads/documents/${employee.employee_id}-offer-letter.pdf`,
          file_type: 'application/pdf',
          file_size: 102400
        }
      });
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from '../prisma/client';

export interface EmployeeFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  designation?: string;
}

export interface CreateEmployeeData {
  employee_id?: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profile_picture?: string | null;
  designation: string;
  department: string;
  joining_date: Date | string;
  salary: number;
}

// In-Memory Fallback Store
interface MemDoc {
  id: string;
  employee_id: string;
  name: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: Date;
  created_at: Date;
  updated_at: Date;
}

interface MemEmp {
  employee_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  profile_picture: string | null;
  designation: string;
  department: string;
  joining_date: Date;
  salary: number;
  created_at: Date;
  updated_at: Date;
  documents?: MemDoc[];
}

let memEmployees: MemEmp[] = [
  {
    employee_id: 'EMP001',
    name: 'Sarah Connor',
    email: 'employee@dayflow.com',
    phone: '+1 (555) 234-5678',
    address: '101 Cyberdyne Way, Los Angeles, CA',
    profile_picture: null,
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    joining_date: new Date('2024-01-15'),
    salary: 75000,
    created_at: new Date('2024-01-15'),
    updated_at: new Date(),
    documents: [
      {
        id: 'doc-001',
        employee_id: 'EMP001',
        name: 'Employment Contract',
        file_name: 'sarah_connor_contract.pdf',
        file_url: '/uploads/documents/sarah_connor_contract.pdf',
        file_type: 'application/pdf',
        file_size: 245000,
        uploaded_at: new Date('2024-01-15'),
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15'),
      },
    ],
  },
  {
    employee_id: 'EMP002',
    name: 'Michael Scott',
    email: 'michael@dayflow.com',
    phone: '+1 (555) 345-6789',
    address: '1725 Slough Avenue, Scranton, PA',
    profile_picture: null,
    designation: 'Regional Director',
    department: 'Management',
    joining_date: new Date('2023-06-01'),
    salary: 85000,
    created_at: new Date('2023-06-01'),
    updated_at: new Date(),
    documents: [],
  },
  {
    employee_id: 'EMP003',
    name: 'Pam Beesly',
    email: 'pam@dayflow.com',
    phone: '+1 (555) 456-7890',
    address: '42 Maple Street, Scranton, PA',
    profile_picture: null,
    designation: 'HR Specialist',
    department: 'Human Resources',
    joining_date: new Date('2023-09-10'),
    salary: 62000,
    created_at: new Date('2023-09-10'),
    updated_at: new Date(),
    documents: [],
  },
  {
    employee_id: 'EMP004',
    name: 'Dwight Schrute',
    email: 'dwight@dayflow.com',
    phone: '+1 (555) 567-8901',
    address: 'Schrute Farms, Honesdale, PA',
    profile_picture: null,
    designation: 'Lead Sales Executive',
    department: 'Sales',
    joining_date: new Date('2023-07-20'),
    salary: 78000,
    created_at: new Date('2023-07-20'),
    updated_at: new Date(),
    documents: [],
  },
];

export class EmployeeService {
  static async getEmployees(params: EmployeeFilterQuery) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(Math.max(1, params.limit || 10), 100);
    const skip = (page - 1) * limit;

    try {
      const where: any = {};
      if (params.search && params.search.trim() !== '') {
        const q = params.search.trim();
        where.OR = [
          { employee_id: { contains: q } },
          { name: { contains: q } },
          { email: { contains: q } },
        ];
      }
      if (params.department && params.department !== 'ALL') {
        where.department = { contains: params.department };
      }
      if (params.designation) {
        where.designation = { contains: params.designation };
      }

      const [employees, total] = await prisma.$transaction([
        prisma.employee.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          include: { documents: true },
        }),
        prisma.employee.count({ where }),
      ]);

      return {
        data: employees,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch {
      let filtered = [...memEmployees];
      if (params.search && params.search.trim() !== '') {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (e) =>
            e.employee_id.toLowerCase().includes(q) ||
            e.name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
      }
      if (params.department && params.department !== 'ALL') {
        filtered = filtered.filter((e) =>
          e.department.toLowerCase().includes(params.department!.toLowerCase())
        );
      }
      if (params.designation) {
        filtered = filtered.filter((e) =>
          e.designation.toLowerCase().includes(params.designation!.toLowerCase())
        );
      }

      const total = filtered.length;
      const data = filtered.slice(skip, skip + limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }
  }

  static async getEmployeeById(employeeId: string) {
    try {
      const emp = await prisma.employee.findUnique({
        where: { employee_id: employeeId },
        include: {
          documents: { orderBy: { uploaded_at: 'desc' } },
          leave_balance: true,
          payroll: true,
        },
      });
      if (!emp) throw { statusCode: 404, message: 'Employee not found' };
      return emp;
    } catch (err: any) {
      if (err.statusCode) throw err;
      const found = memEmployees.find((e) => e.employee_id === employeeId);
      if (!found) throw { statusCode: 404, message: 'Employee not found' };
      return found;
    }
  }

  static async getEmployeeByEmail(email: string) {
    try {
      return await prisma.employee.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { documents: true },
      });
    } catch {
      return (
        memEmployees.find((e) => e.email.toLowerCase() === email.toLowerCase().trim()) || null
      );
    }
  }

  static async createEmployee(data: CreateEmployeeData) {
    const employeeId = data.employee_id || `EMP${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const newEmp = await prisma.employee.create({
        data: {
          employee_id: employeeId,
          name: data.name,
          email: data.email.toLowerCase().trim(),
          phone: data.phone || null,
          address: data.address || null,
          profile_picture: data.profile_picture || null,
          designation: data.designation,
          department: data.department,
          joining_date: new Date(data.joining_date),
          salary: data.salary,
        },
      });
      return newEmp;
    } catch {
      const newEmp: MemEmp = {
        employee_id: employeeId,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
        address: data.address || null,
        profile_picture: data.profile_picture || null,
        designation: data.designation,
        department: data.department,
        joining_date: new Date(data.joining_date),
        salary: Number(data.salary),
        created_at: new Date(),
        updated_at: new Date(),
        documents: [],
      };
      memEmployees.unshift(newEmp);
      return newEmp;
    }
  }

  static async updateEmployee(employeeId: string, data: Partial<CreateEmployeeData>) {
    try {
      const updated = await prisma.employee.update({
        where: { employee_id: employeeId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email.toLowerCase().trim() }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.address !== undefined && { address: data.address }),
          ...(data.profile_picture !== undefined && { profile_picture: data.profile_picture }),
          ...(data.designation && { designation: data.designation }),
          ...(data.department && { department: data.department }),
          ...(data.joining_date && { joining_date: new Date(data.joining_date) }),
          ...(data.salary !== undefined && { salary: data.salary }),
        },
      });
      return updated;
    } catch {
      const idx = memEmployees.findIndex((e) => e.employee_id === employeeId);
      if (idx === -1) throw { statusCode: 404, message: 'Employee not found' };
      const current = memEmployees[idx];
      memEmployees[idx] = {
        ...current,
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.profile_picture !== undefined && { profile_picture: data.profile_picture }),
        ...(data.designation && { designation: data.designation }),
        ...(data.department && { department: data.department }),
        ...(data.joining_date && { joining_date: new Date(data.joining_date) }),
        ...(data.salary !== undefined && { salary: Number(data.salary) }),
        updated_at: new Date(),
      };
      return memEmployees[idx];
    }
  }

  static async updateOwnProfile(employeeId: string, data: { phone?: string | null; address?: string | null }) {
    return this.updateEmployee(employeeId, data);
  }

  static async uploadProfilePicture(employeeId: string, fileUrl: string) {
    return this.updateEmployee(employeeId, { profile_picture: fileUrl });
  }

  static async deleteEmployee(employeeId: string) {
    try {
      await prisma.employee.delete({
        where: { employee_id: employeeId },
      });
      return { success: true };
    } catch {
      const idx = memEmployees.findIndex((e) => e.employee_id === employeeId);
      if (idx === -1) throw { statusCode: 404, message: 'Employee not found' };
      memEmployees.splice(idx, 1);
      return { success: true };
    }
  }

  static async getEmployeeStats() {
    try {
      const total = await prisma.employee.count();
      const departments = await prisma.employee.findMany({
        select: { department: true },
        distinct: ['department'],
      });
      return {
        totalEmployees: total,
        activeEmployees: total,
        departmentsCount: departments.length,
        recentlyAddedCount: Math.min(3, total),
      };
    } catch {
      const total = memEmployees.length;
      const depts = new Set(memEmployees.map((e) => e.department));
      return {
        totalEmployees: total,
        activeEmployees: total,
        departmentsCount: depts.size,
        recentlyAddedCount: Math.min(3, total),
      };
    }
  }

  // Document management methods
  static async getDocuments(employeeId: string) {
    try {
      return await prisma.document.findMany({
        where: { employee_id: employeeId },
        orderBy: { uploaded_at: 'desc' },
      });
    } catch {
      const emp = memEmployees.find((e) => e.employee_id === employeeId);
      return emp?.documents || [];
    }
  }

  static async createDocument(employeeId: string, doc: { name: string; file_name: string; file_url: string; file_type: string; file_size: number }) {
    try {
      return await prisma.document.create({
        data: {
          employee_id: employeeId,
          name: doc.name,
          file_name: doc.file_name,
          file_url: doc.file_url,
          file_type: doc.file_type,
          file_size: doc.file_size,
        },
      });
    } catch {
      const emp = memEmployees.find((e) => e.employee_id === employeeId);
      if (!emp) throw { statusCode: 404, message: 'Employee not found' };
      const newDoc: MemDoc = {
        id: 'doc-' + Math.random().toString(36).substring(2, 9),
        employee_id: employeeId,
        name: doc.name,
        file_name: doc.file_name,
        file_url: doc.file_url,
        file_type: doc.file_type,
        file_size: doc.file_size,
        uploaded_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      if (!emp.documents) emp.documents = [];
      emp.documents.unshift(newDoc);
      return newDoc;
    }
  }

  static async deleteDocument(documentId: string) {
    try {
      await prisma.document.delete({ where: { id: documentId } });
      return { success: true };
    } catch {
      for (const emp of memEmployees) {
        if (emp.documents) {
          const idx = emp.documents.findIndex((d) => d.id === documentId);
          if (idx !== -1) {
            emp.documents.splice(idx, 1);
            return { success: true };
          }
        }
      }
      return { success: true };
    }
  }
}


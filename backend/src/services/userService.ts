import { prisma } from '../prisma/client';
import { hashPassword } from '../utils/password';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employee_id?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employee_id?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-Memory Seed State for Offline / Resilience
let memUsers: UserRecord[] = [];

const initMemUsers = async () => {
  if (memUsers.length === 0) {
    const adminHash = await hashPassword('Admin@123');
    const empHash = await hashPassword('Employee@123');

    memUsers = [
      {
        id: 'usr_admin_001',
        name: 'Alex Rivera (Admin)',
        email: 'admin@dayflow.com',
        password: adminHash,
        role: 'ADMIN',
        employee_id: 'EMP000',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'usr_emp_001',
        name: 'Sarah Connor',
        email: 'employee@dayflow.com',
        password: empHash,
        role: 'EMPLOYEE',
        employee_id: 'EMP001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
    ];
  }
};

initMemUsers();

export class UserService {
  static async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { employee: true },
      });
      return user as any;
    } catch {
      await initMemUsers();
      const found = memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      return found || null;
    }
  }

  static async findById(id: string): Promise<UserRecord | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { employee: true },
      });
      return user as any;
    } catch {
      await initMemUsers();
      const found = memUsers.find((u) => u.id === id);
      return found || null;
    }
  }

  static async createUser(data: CreateUserData): Promise<UserRecord> {
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase().trim(),
          password: data.password,
          role: data.role,
          employee_id: data.employee_id || undefined,
        },
      });
      return user as any;
    } catch {
      await initMemUsers();
      const newUser: UserRecord = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: data.role,
        employee_id: data.employee_id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memUsers.push(newUser);
      return newUser;
    }
  }

  static async findAllUsers(): Promise<UserRecord[]> {
    try {
      return (await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      })) as any;
    } catch {
      await initMemUsers();
      return memUsers;
    }
  }
}


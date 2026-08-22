import { prisma } from '../prisma/client';
import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
  createdAt: Date;
  updatedAt: Date;
}

const FALLBACK_FILE = path.join(__dirname, '../../prisma/fallback_db.json');

// Helper to manage local fallback storage if MySQL password requires setup in .env
function getFallbackUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return data.map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
    }));
  } catch {
    return [];
  }
}

function saveFallbackUsers(users: UserRecord[]): void {
  try {
    const dir = path.dirname(FALLBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Failed to write fallback database file:', err);
  }
}

export const userService = {
  /**
   * Find user by email (Prisma MySQL with fallback)
   */
  async findByEmail(email: string): Promise<UserRecord | null> {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (user) return user as UserRecord;
    } catch (error: any) {
      console.warn('⚡ Prisma MySQL Notice:', error.message || 'Connecting to fallback store');
    }

    // Fallback search
    const fallbackUsers = getFallbackUsers();
    const found = fallbackUsers.find((u) => u.email === cleanEmail);
    return found || null;
  },

  /**
   * Find user by ID (Prisma MySQL with fallback)
   */
  async findById(id: string): Promise<UserRecord | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (user) return user as UserRecord;
    } catch (error: any) {
      console.warn('⚡ Prisma MySQL Notice:', error.message);
    }

    const fallbackUsers = getFallbackUsers();
    const found = fallbackUsers.find((u) => u.id === id);
    return found || null;
  },

  /**
   * Create new user (Prisma MySQL with fallback)
   */
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE';
  }): Promise<UserRecord> {
    const cleanEmail = data.email.toLowerCase().trim();
    try {
      const newUser = await prisma.user.create({
        data: {
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password,
          role: data.role,
        },
      });
      return newUser as UserRecord;
    } catch (error: any) {
      console.warn('⚡ Prisma MySQL Notice: Saving to local storage fallback due to:', error.message);
    }

    // Fallback create
    const fallbackUsers = getFallbackUsers();
    const now = new Date();
    const newUser: UserRecord = {
      id: `usr_${Math.random().toString(36).substring(2, 11)}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: data.role,
      createdAt: now,
      updatedAt: now,
    };

    fallbackUsers.push(newUser);
    saveFallbackUsers(fallbackUsers);
    return newUser;
  },

  /**
   * Find all users (Prisma MySQL with fallback)
   */
  async findAllUsers(): Promise<UserRecord[]> {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (users.length > 0) return users as UserRecord[];
    } catch (error: any) {
      console.warn('⚡ Prisma MySQL Notice:', error.message);
    }

    return getFallbackUsers();
  },
};

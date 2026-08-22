export type Role = 'EMPLOYEE' | 'ADMIN';

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'TERMINATED';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SalaryBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  medicalAllowance?: number;
  grossSalary: number;
  currency: string;
  payFrequency: 'MONTHLY' | 'ANNUAL';
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  type: string; // 'PDF' | 'DOC' | 'PNG' | 'JPG'
  category: 'IDENTITY' | 'CONTRACT' | 'OFFER_LETTER' | 'TAX' | 'EDUCATION' | 'OTHER';
  fileSize: number; // in bytes
  fileSizeFormatted: string;
  uploadedAt: string;
  url?: string;
  uploadedBy?: string;
}

export interface Employee {
  id: string;
  employeeId: string; // EMP-1001 format
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: Address;
  designation: string;
  department: string;
  joiningDate: string;
  status: EmployeeStatus;
  workLocation: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  salary: SalaryBreakdown;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  userId: string;
  employeeId: string;
  role: Role;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface EmployeeSummaryStats {
  totalEmployees: number;
  activeEmployees: number;
  departmentsCount: number;
  recentlyAddedCount: number;
}

export interface EmployeeSearchParams {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

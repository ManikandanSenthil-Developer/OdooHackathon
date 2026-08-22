export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  employee_id?: string;
  name?: string;
}

export interface DocumentItem {
  id: string;
  employee_id: string;
  name: string;
  file_url: string;
  file_type?: string;
  file_size: number;
  uploaded_at: string;
}

export interface Employee {
  id?: string;
  employee_id: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  department: string;
  joining_date: string;
  salary: number;
  address?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  documents?: DocumentItem[];
}

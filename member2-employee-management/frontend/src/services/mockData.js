/**
 * Seed and LocalStorage persistence store for Dayflow HRMS Module 2
 * Provides realistic preloaded employees, job profiles, salary structures, and documents.
 */

const STORAGE_KEY_EMPLOYEES = 'dayflow_hrms_employees_v1';
const STORAGE_KEY_DOCUMENTS = 'dayflow_hrms_documents_v1';

export const INITIAL_EMPLOYEES = [
  {
    id: 'emp-1',
    employeeId: 'EMP-1001',
    fullName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@dayflow.com',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    joiningDate: '2022-04-15',
    status: 'ACTIVE',
    workLocation: 'San Francisco HQ (Hybrid)',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 7500,
      hra: 2500,
      specialAllowance: 1800,
      conveyance: 600,
      medicalAllowance: 400,
      grossSalary: 12800,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Sarah Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    createdAt: '2022-04-15T09:00:00.000Z',
    updatedAt: '2026-08-12T14:30:00.000Z'
  },
  {
    id: 'emp-2',
    employeeId: 'EMP-1002',
    fullName: 'Sarah Jenkins',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@dayflow.com',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '120 Market Street, Apt 12B',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States'
    },
    designation: 'Product Design Lead',
    department: 'Design',
    joiningDate: '2023-01-10',
    status: 'ACTIVE',
    workLocation: 'Seattle Office',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 7200,
      hra: 2400,
      specialAllowance: 1600,
      conveyance: 500,
      medicalAllowance: 400,
      grossSalary: 12100,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Thomas Jenkins',
      relationship: 'Brother',
      phone: '+1 (555) 876-5432'
    },
    createdAt: '2023-01-10T09:00:00.000Z',
    updatedAt: '2026-07-20T11:15:00.000Z'
  },
  {
    id: 'emp-3',
    employeeId: 'EMP-1003',
    fullName: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@dayflow.com',
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '55 Austin Tech Hub, Blvd 9',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States'
    },
    designation: 'Director of Human Resources',
    department: 'Human Resources',
    joiningDate: '2021-08-01',
    status: 'ACTIVE',
    workLocation: 'Austin HQ',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 9000,
      hra: 3000,
      specialAllowance: 2200,
      conveyance: 800,
      medicalAllowance: 500,
      grossSalary: 15500,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Lily Chen',
      relationship: 'Mother',
      phone: '+1 (555) 765-4321'
    },
    createdAt: '2021-08-01T09:00:00.000Z',
    updatedAt: '2026-06-10T16:45:00.000Z'
  },
  {
    id: 'emp-4',
    employeeId: 'EMP-1004',
    fullName: 'Emily Watson',
    firstName: 'Emily',
    lastName: 'Watson',
    email: 'emily.watson@dayflow.com',
    phone: '+1 (555) 567-8901',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '88 Commonwealth Ave',
      city: 'Boston',
      state: 'MA',
      postalCode: '02215',
      country: 'United States'
    },
    designation: 'Senior Financial Analyst',
    department: 'Finance',
    joiningDate: '2023-09-18',
    status: 'ACTIVE',
    workLocation: 'Boston Branch',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 6800,
      hra: 2200,
      specialAllowance: 1500,
      conveyance: 500,
      medicalAllowance: 400,
      grossSalary: 11400,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Arthur Watson',
      relationship: 'Father',
      phone: '+1 (555) 654-3210'
    },
    createdAt: '2023-09-18T09:00:00.000Z',
    updatedAt: '2026-05-14T10:00:00.000Z'
  },
  {
    id: 'emp-5',
    employeeId: 'EMP-1005',
    fullName: 'David Kim',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@dayflow.com',
    phone: '+1 (555) 678-9012',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '450 North Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'United States'
    },
    designation: 'DevOps & Cloud Engineer',
    department: 'Engineering',
    joiningDate: '2024-02-01',
    status: 'ACTIVE',
    workLocation: 'Remote (Chicago)',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 7000,
      hra: 2300,
      specialAllowance: 1700,
      conveyance: 500,
      medicalAllowance: 400,
      grossSalary: 11900,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Grace Kim',
      relationship: 'Sister',
      phone: '+1 (555) 543-2109'
    },
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2026-08-01T08:20:00.000Z'
  },
  {
    id: 'emp-6',
    employeeId: 'EMP-1006',
    fullName: 'Priya Sharma',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@dayflow.com',
    phone: '+1 (555) 789-0123',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '330 Madison Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10017',
      country: 'United States'
    },
    designation: 'Marketing Specialist',
    department: 'Marketing',
    joiningDate: '2024-05-15',
    status: 'PROBATION',
    workLocation: 'New York Office',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 5800,
      hra: 1900,
      specialAllowance: 1200,
      conveyance: 400,
      medicalAllowance: 300,
      grossSalary: 9600,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Raj Sharma',
      relationship: 'Parent',
      phone: '+1 (555) 432-1098'
    },
    createdAt: '2024-05-15T09:00:00.000Z',
    updatedAt: '2026-07-28T13:10:00.000Z'
  },
  {
    id: 'emp-7',
    employeeId: 'EMP-1007',
    fullName: 'Robert Taylor',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@dayflow.com',
    phone: '+1 (555) 890-1234',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    address: {
      street: '1500 Orange Blossom Way',
      city: 'Orlando',
      state: 'FL',
      postalCode: '32801',
      country: 'United States'
    },
    designation: 'Operations Coordinator',
    department: 'Operations',
    joiningDate: '2023-11-01',
    status: 'ON_LEAVE',
    workLocation: 'Orlando Hub',
    employmentType: 'FULL_TIME',
    salary: {
      basic: 5200,
      hra: 1700,
      specialAllowance: 1100,
      conveyance: 400,
      medicalAllowance: 300,
      grossSalary: 8700,
      currency: 'USD',
      payFrequency: 'MONTHLY'
    },
    emergencyContact: {
      name: 'Laura Taylor',
      relationship: 'Spouse',
      phone: '+1 (555) 321-0987'
    },
    createdAt: '2023-11-01T09:00:00.000Z',
    updatedAt: '2026-08-05T09:40:00.000Z'
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    employeeId: 'EMP-1001',
    name: 'Government Identity Proof.pdf',
    type: 'PDF',
    category: 'IDENTITY',
    fileSize: 1258291, // 1.2 MB
    fileSizeFormatted: '1.2 MB',
    uploadedAt: '2026-08-12T10:30:00.000Z',
    uploadedBy: 'John Doe',
    url: '#'
  },
  {
    id: 'doc-2',
    employeeId: 'EMP-1001',
    name: 'Dayflow Offer Letter Signed.pdf',
    type: 'PDF',
    category: 'OFFER_LETTER',
    fileSize: 870400, // 850 KB
    fileSizeFormatted: '850 KB',
    uploadedAt: '2026-08-10T14:15:00.000Z',
    uploadedBy: 'HR Admin',
    url: '#'
  },
  {
    id: 'doc-3',
    employeeId: 'EMP-1001',
    name: 'Employment Contract Agreement.docx',
    type: 'DOC',
    category: 'CONTRACT',
    fileSize: 2411724, // 2.3 MB
    fileSizeFormatted: '2.3 MB',
    uploadedAt: '2026-07-15T09:00:00.000Z',
    uploadedBy: 'HR Admin',
    url: '#'
  },
  {
    id: 'doc-4',
    employeeId: 'EMP-1001',
    name: 'Degree Certificate Verification.png',
    type: 'PNG',
    category: 'EDUCATION',
    fileSize: 1572864, // 1.5 MB
    fileSizeFormatted: '1.5 MB',
    uploadedAt: '2026-06-20T11:45:00.000Z',
    uploadedBy: 'John Doe',
    url: '#'
  },
  {
    id: 'doc-5',
    employeeId: 'EMP-1002',
    name: 'Identity Verification Passport.pdf',
    type: 'PDF',
    category: 'IDENTITY',
    fileSize: 1887436, // 1.8 MB
    fileSizeFormatted: '1.8 MB',
    uploadedAt: '2026-07-18T16:20:00.000Z',
    uploadedBy: 'Sarah Jenkins',
    url: '#'
  },
  {
    id: 'doc-6',
    employeeId: 'EMP-1002',
    name: 'Design Lead Offer Letter.pdf',
    type: 'PDF',
    category: 'OFFER_LETTER',
    fileSize: 943718, // 920 KB
    fileSizeFormatted: '920 KB',
    uploadedAt: '2026-07-10T12:00:00.000Z',
    uploadedBy: 'HR Admin',
    url: '#'
  },
  {
    id: 'doc-7',
    employeeId: 'EMP-1003',
    name: 'Executive Contract Agreement.pdf',
    type: 'PDF',
    category: 'CONTRACT',
    fileSize: 3145728, // 3.0 MB
    fileSizeFormatted: '3.0 MB',
    uploadedAt: '2026-05-12T10:00:00.000Z',
    uploadedBy: 'HR Admin',
    url: '#'
  }
];

export function getStoredEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.employees)) return parsed.employees;
    if (Array.isArray(parsed?.data)) return parsed.data;
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  } catch (e) {
    console.warn('LocalStorage error reading employees:', e);
    return INITIAL_EMPLOYEES;
  }
}

export function saveStoredEmployees(employees) {
  try {
    const dataToSave = Array.isArray(employees) ? employees : INITIAL_EMPLOYEES;
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('LocalStorage error saving employees:', e);
  }
}

export function getStoredDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOCUMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.documents)) return parsed.documents;
    if (Array.isArray(parsed?.data)) return parsed.data;
    localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    return INITIAL_DOCUMENTS;
  } catch (e) {
    console.warn('LocalStorage error reading documents:', e);
    return INITIAL_DOCUMENTS;
  }
}

export function saveStoredDocuments(documents) {
  try {
    const dataToSave = Array.isArray(documents) ? documents : INITIAL_DOCUMENTS;
    localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('LocalStorage error saving documents:', e);
  }
}

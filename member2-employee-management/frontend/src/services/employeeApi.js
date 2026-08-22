import apiClient from './api';

// --- Adapter functions to map Backend (Prisma) to Frontend (React State) --- //

const mapEmployeeFromAPI = (emp) => {
  if (!emp) return null;
  
  // Parse address safely
  let addressObj = { street: '', city: '', state: '', postalCode: '', country: 'United States' };
  try {
    if (emp.address) {
      const parsed = JSON.parse(emp.address);
      if (typeof parsed === 'object') addressObj = { ...addressObj, ...parsed };
    }
  } catch (e) {
    // If it's just a raw string and not JSON
    addressObj.street = emp.address;
  }

  // Parse salary safely
  let salaryObj = { basic: 6000, hra: 2000, specialAllowance: 1000, conveyance: 500, medicalAllowance: 300, grossSalary: 9800, currency: 'USD', payFrequency: 'MONTHLY' };
  if (emp.salary) {
    const numericSalary = Number(emp.salary) || 0;
    salaryObj = { ...salaryObj, basic: numericSalary * 0.6, grossSalary: numericSalary };
  }

  const [firstName, ...lastNameParts] = (emp.name || '').split(' ');

  return {
    id: emp.employee_id, // alias for backwards compatibility
    employeeId: emp.employee_id,
    fullName: emp.name,
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
    email: emp.email,
    phone: emp.phone || '',
    avatarUrl: emp.profile_picture || '',
    address: addressObj,
    designation: emp.designation,
    department: emp.department,
    joiningDate: emp.joining_date ? new Date(emp.joining_date).toISOString().split('T')[0] : '',
    status: 'ACTIVE', // Backend doesn't have status yet, default to ACTIVE
    workLocation: 'Main Office',
    employmentType: 'FULL_TIME',
    salary: salaryObj,
    createdAt: emp.created_at || new Date().toISOString(),
    updatedAt: emp.updated_at || new Date().toISOString()
  };
};

const serializeAddress = (address) => {
  if (!address) return null;
  if (typeof address === 'string') return address;
  return JSON.stringify(address);
};

// --- API Service Methods --- //

/**
 * Get current logged in employee's profile
 * @param {string} employeeId - Optional employeeId override from auth context
 */
export async function getMyProfile(employeeId = 'EMP1001') {
  const response = await apiClient.get(`/employees/${employeeId}`);
  return mapEmployeeFromAPI(response.data.data);
}

/**
 * Get single employee by ID
 * @param {string} employeeId
 */
export async function getEmployee(employeeId) {
  const response = await apiClient.get(`/employees/${employeeId}`);
  return mapEmployeeFromAPI(response.data.data);
}

/**
 * Get all employees with search, department filtering, and pagination
 */
export async function getEmployees(params = {}) {
  // Map frontend params to backend expected params
  const queryParams = {
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search || '',
  };
  
  if (params.department && params.department !== 'ALL') {
    queryParams.department = params.department;
  }
  
  if (params.designation) {
    queryParams.designation = params.designation;
  }

  const response = await apiClient.get('/employees', { params: queryParams });
  
  const mappedData = response.data.data.map(mapEmployeeFromAPI);

  return {
    data: mappedData,
    total: response.data.pagination.total,
    page: response.data.pagination.page,
    limit: response.data.pagination.limit,
    totalPages: response.data.pagination.totalPages
  };
}

/**
 * Get summary stats for admin directory
 */
export async function getEmployeeStats() {
  const response = await getEmployees({ page: 1, limit: 1 }); // Just to get total counts
  const total = response.total;
  
  return {
    totalEmployees: total,
    activeEmployees: total, // Placeholder
    departmentsCount: 5, // Placeholder
    recentlyAddedCount: 2 // Placeholder
  };
}

/**
 * Create new employee (Admin side)
 */
export async function createEmployee(data) {
  const payload = {
    employee_id: data.employeeId || `EMP-${Date.now()}`,
    name: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email,
    phone: data.phone,
    address: serializeAddress(data.address),
    designation: data.designation,
    department: data.department,
    joining_date: data.joiningDate ? new Date(data.joiningDate).toISOString() : new Date().toISOString(),
    salary: data.salary?.grossSalary || data.salary || 6000
  };

  const response = await apiClient.post('/employees', payload);
  return mapEmployeeFromAPI(response.data.data);
}

/**
 * Update full employee profile (Admin side)
 */
export async function updateEmployee(employeeId, data) {
  const payload = {};
  if (data.fullName) payload.name = data.fullName;
  if (data.email) payload.email = data.email;
  if (data.phone) payload.phone = data.phone;
  if (data.address) payload.address = serializeAddress(data.address);
  if (data.designation) payload.designation = data.designation;
  if (data.department) payload.department = data.department;
  if (data.joiningDate) payload.joining_date = new Date(data.joiningDate).toISOString();
  if (data.salary) payload.salary = data.salary.grossSalary || Number(data.salary);

  const response = await apiClient.put(`/employees/${employeeId}`, payload);
  return mapEmployeeFromAPI(response.data.data);
}

/**
 * Update employee self-editable fields (Employee side)
 */
export async function updateMyProfile(data) {
  const targetId = data.employeeId || data.id;
  const payload = {
    phone: data.phone,
    address: serializeAddress(data.address)
  };

  const response = await apiClient.patch(`/employees/${targetId}/profile`, payload);
  return mapEmployeeFromAPI(response.data.data);
}

/**
 * Upload profile picture for employee
 */
export async function uploadProfilePicture(employeeId, file) {
  const formData = new FormData();
  formData.append('profile_picture', file);
  const response = await apiClient.patch(`/employees/${employeeId}/profile-picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return { 
    avatarUrl: response.data.data.profile_picture, 
    message: response.data.message 
  };
}

/**
 * Delete employee (Admin side)
 */
export async function deleteEmployee(employeeId) {
  const response = await apiClient.delete(`/employees/${employeeId}`);
  return response.data;
}

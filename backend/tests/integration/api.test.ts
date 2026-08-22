import request from 'supertest';
import app from '../../src/server';

describe('Dayflow HRMS Unified API Integration Tests', () => {
  let adminToken: string;
  let employeeToken: string;
  let createdEmployeeId = 'EMP999';

  describe('Healthcheck Endpoint', () => {
    test('GET /api/health returns 200 and system metadata', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.system).toContain('Dayflow HRMS');
    });
  });

  describe('Authentication & RBAC Flows', () => {
    test('POST /api/auth/signup registers a new user and returns JWT', async () => {
      const uniqueEmail = `test.user.${Date.now()}@dayflow.com`;
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Integration Tester',
          email: uniqueEmail,
          password: 'Password@123',
          role: 'EMPLOYEE',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    test('POST /api/auth/login authenticates Admin and returns JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@dayflow.com',
          password: 'Admin@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      adminToken = res.body.token;
    });

    test('POST /api/auth/login authenticates Employee and returns JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'employee@dayflow.com',
          password: 'Employee@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      employeeToken = res.body.token;
    });

    test('GET /api/auth/me returns current user profile with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('employee@dayflow.com');
    });

    test('GET /api/auth/me rejects unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('RBAC: Employee is blocked from accessing Admin endpoints with 403', async () => {
      const res = await request(app)
        .get('/api/admin/leave')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    test('RBAC: Admin is granted access to Admin endpoints with 200', async () => {
      const res = await request(app)
        .get('/api/admin/leave')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Employee Management API', () => {
    test('POST /api/employees allows Admin to create a new employee', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          employee_id: createdEmployeeId,
          name: 'Jane Doe',
          email: `jane.${Date.now()}@dayflow.com`,
          phone: '+1 555-4321',
          designation: 'DevOps Specialist',
          department: 'Engineering',
          joining_date: '2024-02-01',
          salary: 80000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employee_id).toBe(createdEmployeeId);
    });

    test('GET /api/employees returns paginated directory for Admin', async () => {
      const res = await request(app)
        .get('/api/employees?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    test('GET /api/employees/:id returns detailed employee information', async () => {
      const res = await request(app)
        .get(`/api/employees/${createdEmployeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Jane Doe');
    });

    test('PATCH /api/employees/:id/profile updates contact details', async () => {
      const res = await request(app)
        .patch(`/api/employees/${createdEmployeeId}/profile`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          phone: '+1 555-9999',
          address: '456 Innovation Drive, Austin, TX',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Attendance Management API', () => {
    test('POST /api/attendance/check-in allows employee to clock in', async () => {
      const res = await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      // Could be 201 (new checkin) or 400 (already checked in for today)
      expect([201, 400]).toContain(res.status);
    });

    test('GET /api/attendance/today returns today attendance status', async () => {
      const res = await request(app)
        .get('/api/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('GET /api/attendance/week returns weekly attendance log', async () => {
      const res = await request(app)
        .get('/api/attendance/week')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Leave Management API', () => {
    let leaveId: string;

    test('GET /api/leave/balance returns available leave quotas', async () => {
      const res = await request(app)
        .get('/api/leave/balance')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.paid_leave).toBeDefined();
    });

    test('POST /api/leave submits a valid leave request', async () => {
      const res = await request(app)
        .post('/api/leave')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leave_type: 'PAID',
          start_date: '2026-12-01',
          end_date: '2026-12-02',
          remarks: 'Winter Holiday',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      leaveId = res.body.data.id;
    });

    test('PUT /api/admin/leave/:id/approve allows Admin to approve request', async () => {
      if (!leaveId) return;

      const res = await request(app)
        .put(`/api/admin/leave/${leaveId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          admin_comment: 'Approved for winter holidays',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('APPROVED');
    });
  });

  describe('Payroll Management API', () => {
    test('GET /api/payroll/my returns employee salary structure and paystubs', async () => {
      const res = await request(app)
        .get('/api/payroll/my')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.net_salary).toBeDefined();
    });

    test('GET /api/admin/payroll returns workforce payroll directory for Admin', async () => {
      const res = await request(app)
        .get('/api/admin/payroll')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('PUT /api/admin/payroll/:id updates salary structure and recalculates net', async () => {
      const res = await request(app)
        .put('/api/admin/payroll/EMP001')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          basic_salary: 60000,
          total_allowances: 14000,
          total_deductions: 5000,
          pay_cycle: 'Monthly (28th of every month)',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.net_salary)).toBe(69000);
    });
  });

  describe('Dashboard Telemetry API', () => {
    test('GET /api/dashboard/employee returns consolidated employee metrics', async () => {
      const res = await request(app)
        .get('/api/dashboard/employee')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.attendance).toBeDefined();
      expect(res.body.data.leaveRequests).toBeDefined();
      expect(res.body.data.salary).toBeDefined();
    });

    test('GET /api/dashboard/admin returns consolidated administrative oversight', async () => {
      const res = await request(app)
        .get('/api/dashboard/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.attendanceSummary).toBeDefined();
      expect(res.body.data.payrollOverview).toBeDefined();
    });
  });
});


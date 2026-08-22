# DAYFLOW HRMS — Unified Enterprise Workforce Platform

> **Dayflow HRMS** is an integrated Human Resource Management System combining **Authentication & RBAC**, **Workforce Directory & Profile Management**, **Real-Time Attendance**, **Leave Quota & Approvals**, and **Automated Payroll & Salary Processing** into one production-quality fullstack application.

---

## 🌟 Integrated Capabilities

### 1. Authentication & Role-Based Access Control (RBAC)
- 🔒 **Secure JWT Authentication**: Powered by bcrypt password hashing and 24-hour JSON Web Tokens.
- 🛡️ **Granular Roles**: Role separation between `EMPLOYEE` (self-service) and `ADMIN` (workforce governance).
- 🚦 **Protected Frontend Routes**: Automatic redirection for unauthenticated or unauthorized users.

### 2. Workforce & Profile Management
- 👥 **Employee Directory**: Paginated, searchable by name/ID/email, and filterable by department.
- 🗂️ **Profile & Document Vault**: Centralized employee profile viewing with avatars and employment document attachments.
- 📝 **Self-Service Updates**: Employees can manage their contact phone, address, and profile photo.

### 3. Smart Attendance Tracking
- ⏱️ **Live Clock-In / Clock-Out**: Single-click time tracking with automated daily working hours calculation.
- 📅 **7-Day Attendance History**: Personal attendance trends with status badges (`PRESENT`, `ABSENT`, `HALFDAY`, `LEAVE`).
- 🏢 **Workforce Attendance Oversight**: Administrative attendance logs with date filtering and departmental on-time rates.

### 4. Leave Quota & Approval Workflows
- 📊 **Quota Balance Governance**: 18 days Paid Annual Leave, 12 days Sick Leave, and Unpaid Leave with live available balance tracking.
- 🗓️ **Leave Application Modal**: Real-time calendar day calculation with quota validation.
- ✅ **Two-Way Approval Workflow**: Admins review, approve, or reject leave requests with review notes.

### 5. Deterministic Payroll & Paystubs
- 💵 **Net Salary Computation Engine**: Deterministic calculation: `Net Salary = Basic Salary + Total Allowances - Total Deductions`.
- ⚙️ **Salary Structure Configuration**: Admins configure custom allowance/deduction breakdowns with live net previews.
- 📄 **Paystub Ledger**: Monthly compensation disbursement records with direct deposit summaries.

---

## 🛠️ Unified Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Axios, React Router DOM v6 |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, MySQL, JWT, Bcrypt, Multer, Zod |
| **Testing** | Jest, ts-jest, Supertest (45 Unit & Integration Tests Passing) |
| **Design System** | Dayflow Palette (`#00ABE4` Primary, `#E9F1FA` Light Blue, Glassmorphic elevation) |

---

## 📂 Project Structure

```text
OdooHackathon/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Unified database schema (7 models, relations & cascades)
│   │   └── seed.ts             # Demo data population script
│   ├── src/
│   │   ├── config/             # Server configurations & env loader
│   │   ├── controllers/        # Auth, Employee, Document, Attendance, Leave, Payroll, Dashboard
│   │   ├── middleware/         # authMiddleware, uploadMiddleware, errorMiddleware
│   │   ├── prisma/             # Prisma client singleton
│   │   ├── routes/             # Modular Express routers & index.ts
│   │   ├── services/           # Service layer with resilient offline fallbacks
│   │   ├── utils/              # JWT, password, dateUtils, salaryCalculator
│   │   ├── validators/         # Zod schemas
│   │   └── server.ts           # Express server entry point
│   ├── tests/
│   │   ├── unit/               # salaryCalculator, dateUtils, leaveStateMachine tests
│   │   └── integration/        # API end-to-end Supertest suite
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, ProtectedRoute, StatusBadge, Skeleton, Dialog
│   │   │   ├── employees/      # EmployeeTable, EmployeeForm, DocumentList, ProfilePicture
│   │   │   ├── attendance/     # AttendanceCard, AttendanceTable
│   │   │   ├── leave/          # LeaveBalanceCard, LeaveFormModal, LeaveHistoryTable, LeaveDetailsModal
│   │   │   ├── payroll/        # SalarySummaryCard, PaystubHistoryTable, PayrollTable, SalaryEditModal
│   │   │   └── dashboard/      # DashboardCard
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useAuth, useToast
│   │   ├── pages/              # LandingPage, Login, Signup, Dashboards, Directory, Detail, Attendance, Leave, Payroll, Profile
│   │   ├── routes/             # AppRoutes (RBAC Route tree)
│   │   ├── services/           # Axios client with JWT interceptor & service modules
│   │   ├── styles/             # Tailwind CSS & custom design system
│   │   ├── types/              # TypeScript interfaces across all 4 modules
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Push database schema to MySQL (Prisma)
npx prisma db push

# (Optional) Seed demo accounts and records
npm run seed

# Run automated tests (45 Unit & Integration tests)
npm test

# Run backend development server
npm run dev
```
> Backend starts on `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run frontend development server
npm run dev

# Or build for production
npm run build
```
> Frontend runs on `http://localhost:5173` (or `http://localhost:3000`)

---

## 🔑 Demo Login Credentials

The system comes pre-seeded with ready-to-test accounts:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin / HR Officer** | `admin@dayflow.com` | `Admin@123` | Workforce Directory, Attendance Oversight, Leave Approvals, Payroll Control, Dashboards |
| **Employee** | `employee@dayflow.com` | `Employee@123` | Self-Service Dashboard, Clock-In/Out, Apply Leave, View Salary & Paystubs, Edit Profile |

---

## 📡 API Reference Overview

| Module | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health` | Service health status | Public |
| **Auth** | `POST` | `/api/auth/signup` | Register user account | Public |
| **Auth** | `POST` | `/api/auth/login` | Login user & issue JWT | Public |
| **Auth** | `GET` | `/api/auth/me` | Current authenticated user | Authenticated |
| **Employees** | `GET` | `/api/employees` | Searchable employee directory | Admin / HR |
| **Employees** | `POST` | `/api/employees` | Create employee profile | Admin / HR |
| **Employees** | `GET` | `/api/employees/:id` | Employee profile details | Authenticated |
| **Employees** | `PATCH` | `/api/employees/:id/profile`| Update contact phone/address | Employee / Admin |
| **Attendance** | `POST` | `/api/attendance/check-in` | Clock in for today | Employee / Admin |
| **Attendance** | `POST` | `/api/attendance/check-out` | Clock out for today | Employee / Admin |
| **Attendance** | `GET` | `/api/attendance/today` | Today's clock-in/out status | Employee / Admin |
| **Attendance** | `GET` | `/api/attendance/week` | 7-day attendance logs | Employee / Admin |
| **Leave** | `GET` | `/api/leave/balance` | Available leave quotas | Employee / Admin |
| **Leave** | `POST` | `/api/leave` | Apply for time-off | Employee / Admin |
| **Leave** | `GET` | `/api/admin/leave` | All workforce leave requests | Admin / HR |
| **Leave** | `PUT` | `/api/admin/leave/:id/approve`| Approve leave & deduct balance | Admin / HR |
| **Leave** | `PUT` | `/api/admin/leave/:id/reject` | Reject leave request | Admin / HR |
| **Payroll** | `GET` | `/api/payroll/my` | Personal compensation & paystubs | Employee / Admin |
| **Payroll** | `GET` | `/api/admin/payroll` | Workforce payroll records | Admin / HR |
| **Payroll** | `PUT` | `/api/admin/payroll/:id`| Update salary structure | Admin / HR |
| **Dashboard** | `GET` | `/api/dashboard/employee` | Consolidated employee dashboard | Authenticated |
| **Dashboard** | `GET` | `/api/dashboard/admin` | Consolidated admin dashboard | Admin / HR |

---

## 🧪 Testing Report

```text
Test Suites: 4 passed, 4 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        15.099 s
```

- ✅ **Salary Calculation Engine**: Validated standard computations, boundary conditions, zero deduction/allowance values, negative value guards, and deduction overflow validation.
- ✅ **Date Utilities**: Validated 1-day/multi-day inclusive range calculations, date inversion errors, ISO string parser, and calendar day bounds.
- ✅ **Leave State Machine**: Validated quota balance checks, excessive day rejection, pending state transitions, admin approvals, balance deduction, and double-approval prevention.
- ✅ **API Integration**: Validated end-to-end auth, role guards (403 Forbidden for unauthorized roles), CRUD operations, attendance check-in/out, leave approvals, payroll edits, and dashboard telemetry.

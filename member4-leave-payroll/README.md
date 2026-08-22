# Dayflow HRMS — Module 4: Leave & Payroll Management

> **Dayflow** is a modern Human Resource Management System (HRMS).
> This module (**Module 4**) delivers an enterprise-grade **Leave Management** workflow and a robust **Payroll Management** system designed to work independently today and merge seamlessly with the team's unified HRMS platform.

---

## 📌 Module Scope & Responsibility

As **Member 4**, this repository strictly manages:

1. **Leave Management**:
   - 📅 **Employee Self-Service**: Live leave balance quotas (Paid, Sick, Unpaid), interactive leave application form with automated backend calendar-day computation, date validation, and personal leave history.
   - 🛡️ **Admin / HR Command Center**: Global workforce leave directory, search & multi-parameter filtering, modal-driven approval & rejection workflows with mandatory/optional HR remarks and audit tracking.
   - ⚖️ **Balance Quotas & State Machine**: Source-of-truth leave deduction logic, transition guards (`PENDING -> APPROVED` or `PENDING -> REJECTED`), preventing illegal double-approvals or reversals.

2. **Payroll Management**:
   - 💵 **Employee Compensation View (Read-Only)**: Clear breakdown of Basic Salary, Allowances, Deductions, and calculated Net Paystub history with bank disbursement details.
   - 👑 **Admin Payroll Administration**: Centralized compensation overview for all department employees, real-time live preview salary structure editor, financial non-negativity enforcement, and net salary recalculation.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries & Standards |
| :--- | :--- | :--- |
| **Frontend** | React 18 (TypeScript) | Vite, Tailwind CSS, Lucide React, Axios, React Router DOM 6 |
| **Backend** | Node.js & Express.js (TypeScript) | Prisma ORM, CORS, Dotenv, JSON Web Tokens (`jsonwebtoken`) |
| **Database** | MySQL | Prisma Schema with Enums, Decimal precision, Indexes |
| **Design System** | SF Pro Display Stack | Primary Blue (`#00ABE4`), Light Blue (`#E9F1FA`), Slate (`#1F2937`), Soft Gradients |

---

## 📂 Module File Structure

```
member4-leave-payroll/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # LeaveRequest, LeaveBalance, Payroll & Paystub models
│   │   └── seed.ts                # Seed demo data for employees & leave balances
│   ├── src/
│   │   ├── config/index.ts        # Environment & Dev mode config
│   │   ├── controllers/           # leave.controller.ts, payroll.controller.ts
│   │   ├── middleware/            # authAdapter.ts, role.middleware.ts, error.middleware.ts
│   │   ├── prisma/client.ts       # Prisma client singleton
│   │   ├── routes/                # leave.routes.ts, payroll.routes.ts, index.ts
│   │   ├── services/              # leave.service.ts, payroll.service.ts
│   │   ├── types/                 # auth.types.ts, leave.types.ts, payroll.types.ts
│   │   ├── utils/                 # dateUtils.ts, salaryCalculator.ts
│   │   └── server.ts              # Express API server entrypoint
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Navbar, StatusBadge, Toast, LoadingSkeleton, EmptyState
│   │   │   ├── leave/             # LeaveBalanceCard, LeaveFormModal, LeaveHistoryTable, LeaveDetailsModal
│   │   │   └── payroll/           # SalarySummaryCard, PaystubHistoryTable, PayrollTable, SalaryEditModal, PayrollDetailsModal
│   │   ├── pages/
│   │   │   ├── employee/          # LeavePage.tsx (/leave), SalaryPage.tsx (/salary)
│   │   │   └── admin/             # AdminLeavePage.tsx (/admin/leave), AdminPayrollPage.tsx (/admin/payroll)
│   │   ├── services/              # api.ts, leaveService.ts, payrollService.ts
│   │   ├── types/                 # leave.ts, payroll.ts
│   │   ├── hooks/                 # useToast.ts
│   │   ├── routes/                # AppRoutes.tsx
│   │   ├── styles/                # index.css (Tailwind & Dayflow gradients)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema & Models

### `LeaveRequest`
Stores employee leave submissions and HR review status.
- `id`: UUID Primary Key
- `employee_id`: String (Integration key with Member 2 Employee)
- `employee_name`: String
- `employee_email`: String (Optional)
- `leave_type`: Enum (`PAID`, `SICK`, `UNPAID`)
- `start_date`: DateTime
- `end_date`: DateTime
- `total_days`: Int (Calculated server-side)
- `remarks`: Text
- `status`: Enum (`PENDING`, `APPROVED`, `REJECTED`)
- `admin_comment`: Text
- `approved_by`: String
- `approved_at`: DateTime

### `LeaveBalance`
Maintains real-time quota tracking per employee.
- `employee_id`: String (Unique)
- `paid_leave_total`: Int (Default: 18)
- `paid_leave_used`: Int
- `sick_leave_total`: Int (Default: 12)
- `sick_leave_used`: Int
- `unpaid_leave_used`: Int

### `Payroll` & `SalaryPaystub`
- `basic_salary`: Decimal(12,2)
- `total_allowances`: Decimal(12,2)
- `total_deductions`: Decimal(12,2)
- `net_salary`: Decimal(12,2) — Computed as `Basic + Allowances - Deductions`

---

## 📡 REST API Reference

### Leave Management

| Method | Route | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leave` | Employee / Admin | Submit new leave application (Backend calculates `total_days`) |
| `GET` | `/api/leave/my` | Employee / Admin | Retrieve logged-in employee's personal leave history |
| `GET` | `/api/leave/balance` | Employee / Admin | Retrieve quota balances (Paid, Sick, Unpaid) |
| `GET` | `/api/leave/:id` | Owner / Admin | Retrieve details for a single leave request |
| `GET` | `/api/admin/leave` | Admin Only | Search & filter all employee requests (by status, type, keyword) |
| `GET` | `/api/admin/leave/history` | Admin Only | Filter processed leave requests history |
| `PUT` | `/api/admin/leave/:id/approve` | Admin Only | Approve request, deduct leave balance, attach HR note |
| `PUT` | `/api/admin/leave/:id/reject` | Admin Only | Reject request, attach reason note |

### Payroll Management

| Method | Route | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/payroll/my` | Employee / Admin | Retrieve personal salary structure & past paystubs (Read-Only) |
| `GET` | `/api/admin/payroll` | Admin Only | List workforce payroll directory with calculated net salaries |
| `GET` | `/api/admin/payroll/:employeeId` | Admin Only | Retrieve specific employee compensation breakdown |
| `PUT` | `/api/admin/payroll/:employeeId` | Admin Only | Update salary components (recalculates & persists net salary) |

---

## 🚦 Security & Authorization Rules

1. **Strict Employee Isolation**: An employee can only apply for leaves under their own authenticated identity and can only access their own leave history and salary record.
2. **Role Enforcement**: All `/api/admin/*` endpoints strictly require the `ADMIN` role (returns `403 Forbidden` otherwise).
3. **Backend Source of Truth**:
   - Dates and total days are calculated server-side.
   - Net salary is calculated server-side (`Basic + Allowances - Deductions`).
   - Leave balances are updated atomically during approval.

---

## 🔌 Integration Boundary & Contracts

This module is designed as an independent team module and will be integrated into the main Dayflow HRMS later.

### 1. Authentication Integration (Member 1)
- **Token Contract**: Expects `Authorization: Bearer <token>`.
- **Decoded Payload**:
  ```json
  {
    "id": "usr_94a2b1",
    "email": "sarah@company.com",
    "role": "EMPLOYEE" // or "ADMIN"
  }
  ```
- **Standalone Development**: An internal `authAdapter.ts` allows testing both `EMPLOYEE` and `ADMIN` perspectives without needing Member 1's backend running.

### 2. Employee Identity Integration (Member 2)
- Models reference `employee_id` (e.g. `EMP-001`) to cleanly relate with Member 2's `Employee` model upon final merge.

### 3. Attendance Integration (Member 3)
- When a leave request is marked `APPROVED`, a future event hook or database query can mark the employee's attendance record for those dates as `LEAVE`.

---

## 🚀 Quickstart & Running Locally

### 1. Backend Setup

```bash
cd member4-leave-payroll/backend

# Install dependencies
npm.cmd install

# Generate Prisma client
npx.cmd prisma generate

# Push database schema to MySQL
npx.cmd prisma db push

# Seed sample employees, balances & payroll records
npm.cmd run seed

# Start development server
npm.cmd run dev
```
> Backend runs on **`http://localhost:5000`** (Healthcheck: `http://localhost:5000/api/health`)

### 2. Frontend Setup

```bash
cd member4-leave-payroll/frontend

# Install dependencies
npm.cmd install

# Start Vite dev server
npm.cmd run dev
```
> Frontend runs on **`http://localhost:3004`** (or Vite assigned port)

---

## 🧪 Testing Guide

1. **Employee Leave Flow**:
   - Navigate to `/leave`.
   - Check leave balances (Paid: 14 Days Available, Sick: 10 Days Available).
   - Click **Apply for Leave**, select dates and remarks -> Submit.
   - Verify request appears in history with `PENDING` status badge.
2. **Admin Leave Approval Flow**:
   - Click the top right **Toggle View** button to switch to **HR Admin View**.
   - Navigate to `/admin/leave`.
   - Locate the pending request, click **View**, enter an optional comment, and click **Approve Request**.
   - Switch back to **Employee View** and observe that the leave status is now `APPROVED` and the available balance has decreased.
3. **Payroll & Compensation Flow**:
   - Visit `/salary` as an Employee -> Confirm all figures are cleanly displayed in Read-Only mode.
   - Switch to **HR Admin View** -> Visit `/admin/payroll`.
   - Click **Edit Salary** on an employee -> Change Basic Salary or Allowances -> Verify live net salary calculation and save -> Confirm changes persist in database.

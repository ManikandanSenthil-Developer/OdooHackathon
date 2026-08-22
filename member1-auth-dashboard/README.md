# Dayflow HRMS - Authentication, Authorization & Dashboard Module

> **Dayflow** is a modern Human Resource Management System (HRMS) designed for workforce management, attendance tracking, leave approval workflows, and payroll control.

---

## 🌟 Features Overview

- 🔒 **User Authentication**: Secure Signup & Login powered by bcrypt password hashing and JWT (JSON Web Tokens).
- 🛡️ **Role-Based Authorization (RBAC)**: Role middleware distinguishing between `EMPLOYEE` and `ADMIN` / HR Officers.
- 🚦 **Protected Routes**: React Router guards ensuring unauthenticated or unauthorized users are automatically redirected.
- 🎨 **Enterprise SaaS UI**: Inspired by professional HR platforms (Workday, Deel, Rippling) using custom SF Pro Display typography, `#00ABE4` primary blue palette, rounded cards, and soft elevation shadows.
- 📊 **Employee Self-Service Portal**: Interactive welcome card, clock-in/clock-out simulator, leave application modal, and salary paystub breakdown.
- 👑 **Admin Command Center**: Workforce directory search, department attendance oversight, live leave approval workflow (Approve/Reject actions), and monthly payroll batch controls.
- 🗄️ **Database Persistence**: MySQL schema powered by Prisma ORM with automated fallback persistence.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18) with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with custom Bearer JWT request & 401 response interceptors
- **Icons**: Lucide React
- **Styling**: Modern SaaS CSS design system (Vanilla CSS with CSS Variables)

### Backend
- **Runtime**: Node.js & Express.js with TypeScript
- **Authentication**: JWT (`jsonwebtoken`) & `bcrypt` password hashing
- **Database**: MySQL
- **ORM**: Prisma ORM

---

## 📂 Project Structure

```
dayflow-auth-dashboard/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma MySQL User schema & Role enum
│   │   └── seed.ts             # Demo accounts seeding script
│   ├── src/
│   │   ├── config/             # Environment variables & constants
│   │   ├── controllers/        # Auth & Dashboard business logic
│   │   ├── middleware/         # verifyToken, adminOnly, employeeOnly, errorHandler
│   │   ├── prisma/             # Prisma client singleton
│   │   ├── routes/             # Express routes (/api/auth, /api/dashboard)
│   │   ├── services/           # User data service layer
│   │   ├── utils/              # JWT & bcrypt password helper functions
│   │   └── server.ts           # Express server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/         # Navbar, ProtectedRoute, DashboardCard
    │   ├── context/            # AuthContext (login, logout, currentUser, token)
    │   ├── hooks/              # useAuth hook
    │   ├── pages/              # LandingPage, SignupPage, LoginPage, EmployeeDashboard, AdminDashboard
    │   ├── routes/             # AppRoutes definition
    │   ├── services/           # Axios API instance with Bearer interceptors
    │   ├── styles/             # SF Pro Display design system (index.css)
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── .env
```

---

## 🚀 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:@localhost:3306/dayflow_db"
JWT_SECRET="dayflow_super_secret_jwt_key_2026_hrms"
JWT_EXPIRES_IN="24h"
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Installation & Setup

### 1. Backend Setup

```bash
cd dayflow-auth-dashboard/backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create/Push Database Schema to MySQL
npx prisma db push

# (Optional) Seed Demo Admin & Employee accounts
npm run seed

# Run Backend in Development Mode
npm run dev
```
> Backend runs on `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd dayflow-auth-dashboard/frontend

# Install dependencies
npm install

# Run Frontend Development Server
npm run dev
```
> Frontend runs on `http://localhost:3000`

---

## 🔑 Demo Credentials

To test the application immediately, use the built-in quick demo credentials or create a new account on `/signup`:

| Role | Email | Password | Allowed Access |
| :--- | :--- | :--- | :--- |
| **Admin / HR Officer** | `admin@dayflow.com` | `Admin@123` | Landing, Login, Signup, Employee Dashboard, Admin Dashboard |
| **Employee** | `employee@dayflow.com` | `Employee@123` | Landing, Login, Signup, Employee Dashboard |

---

## 📡 API Documentation

### Auth Endpoints (`/api/auth`)

#### 1. Signup User
- **Endpoint**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@company.com",
    "password": "Password@123",
    "role": "EMPLOYEE"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account created successfully!",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "usr_94a2b1",
      "name": "Sarah Connor",
      "email": "sarah@company.com",
      "role": "EMPLOYEE"
    }
  }
  ```

#### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "sarah@company.com",
    "password": "Password@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "usr_94a2b1",
      "name": "Sarah Connor",
      "email": "sarah@company.com",
      "role": "EMPLOYEE"
    }
  }
  ```

#### 3. Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_94a2b1",
      "name": "Sarah Connor",
      "email": "sarah@company.com",
      "role": "EMPLOYEE"
    }
  }
  ```

---

### Dashboard Endpoints (`/api/dashboard`)

#### 1. Employee Dashboard Data
- **Endpoint**: `GET /api/dashboard/employee`
- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Access**: `EMPLOYEE` or `ADMIN`
- **Returns**: Employee profile, attendance logs, leave balances, and salary paystubs.

#### 2. Admin Dashboard Data
- **Endpoint**: `GET /api/dashboard/admin`
- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Access**: `ADMIN` only (Returns `403 Forbidden` for `EMPLOYEE`)
- **Returns**: Workforce directory, department attendance breakdown, leave approval applications, and payroll overview.

---

## 🖼️ Screenshots & UI Previews

### 1. Landing Page (`/`)
*Modern HRMS Hero section with "Every workday, perfectly aligned" title, feature highlights, and authentication controls.*

### 2. Login Page (`/login`) & Signup Page (`/signup`)
*Clean form design with role selector, password hashing, JWT generation, and Quick Demo auto-fill buttons.*

### 3. Employee Dashboard (`/employee-dashboard`)
*Personalized employee hub displaying attendance clock-in telemetry, leave balance requests, and paystubs.*

### 4. Admin Dashboard (`/admin-dashboard`)
*Executive control panel showing user directory search, attendance rate analytics, leave approve/reject actions, and payroll disbursement.*

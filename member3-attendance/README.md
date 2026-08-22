# Dayflow Attendance Module

## Features

- Employee check-in and check-out
- Today's attendance summary
- Seven-day attendance history
- Admin attendance listing with employee and date filters
- Present, half-day, and leave statistics

## Folder Structure

```text
backend/
  prisma/schema.prisma
  src/controllers/attendanceController.ts
  src/routes/attendanceRoutes.ts
  src/prisma/client.ts
  src/server.ts
frontend/
  src/pages/attendance/
  src/components/attendance/
  src/services/attendance.api.ts
```

## Installation

```powershell
cd backend
npm install
npx prisma generate
cd ..\frontend
npm install
```

## Environment Variables

Create `backend/.env` from `.env.example`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/dayflow"
PORT=5000
```

Optional frontend API override:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The existing authentication application must provide `dayflow_token` in local storage.

## API Endpoints

- `POST /api/attendance/check-in`
- `POST /api/attendance/check-out`
- `GET /api/attendance/today`
- `GET /api/attendance/week`
- `GET /api/attendance/all?employeeId=...&date=YYYY-MM-DD`

## Run Commands

Backend:

```powershell
cd backend
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```
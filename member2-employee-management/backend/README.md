# Dayflow HRMS - Module 2 (Employee Profile & Management) Backend

This backend implements the Employee Profile and Management capabilities for the Dayflow HRMS. It uses Node.js, Express, Prisma ORM, and MySQL.

## Structure
- **config**: Environment and database configurations
- **controllers**: Handles API requests
- **routes**: Defines API endpoints
- **middleware**: Validation, Authentication (mocked for RBAC), and Error handling
- **validators**: Zod validation schemas
- **prisma**: Schema and Seed scripts

## Database Configuration
1. Make sure you have MySQL installed.
2. Create a `.env` file from `.env.example`: `cp .env.example .env`
3. Update the `DATABASE_URL` in `.env` to point to your local MySQL database. Example: `DATABASE_URL="mysql://root:password@localhost:3306/dayflow"`

## Setup Instructions
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev --name init_employee_management

# Generate Prisma Client
npx prisma generate

# Seed test data
npm run prisma db seed
```

## Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Exploring Data
You can explore the database using Prisma Studio:
```bash
npx prisma studio
```

## API Endpoints

### Employees
| Method | Endpoint | Description | Role Required |
| --- | --- | --- | --- |
| GET | `/api/employees` | List all employees (paginated) | ADMIN |
| POST | `/api/employees` | Create new employee | ADMIN |
| GET | `/api/employees/:employeeId` | Get employee details | ADMIN or SELF |
| PUT | `/api/employees/:employeeId` | Full update | ADMIN |
| DELETE | `/api/employees/:employeeId` | Delete employee | ADMIN |
| PATCH | `/api/employees/:employeeId/profile` | Update contact info | SELF |
| PATCH | `/api/employees/:employeeId/profile-picture`| Upload picture | ADMIN or SELF |

### Documents
| Method | Endpoint | Description | Role Required |
| --- | --- | --- | --- |
| GET | `/api/employees/:employeeId/documents` | Get employee docs | ADMIN or SELF |
| POST | `/api/employees/:employeeId/documents` | Upload document | ADMIN or SELF |
| GET | `/api/documents/:documentId` | Get document details | ADMIN or SELF |
| DELETE | `/api/documents/:documentId` | Delete document | ADMIN or SELF |

## Authentication Mock
Currently, Member 1 is building Authentication. We have temporarily mocked RBAC via custom headers:
- `x-mock-role`: "ADMIN" or "EMPLOYEE"
- `x-mock-employee-id`: e.g., "EMP001"

These headers tell the backend who is making the request for Role-Based Access Control logic testing.

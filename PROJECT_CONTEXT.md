# Operations-Monitoring-System - Project Context

## Project Overview
**Name:** Operations-Monitoring-System  
**Repository:** KenFemboy/Operations-Monitoring-System  
**Author:** Ken Labrador  
**Type:** Full-stack MERN (MongoDB, Express, React, Node.js) application  
**Purpose:** HR and Operations monitoring system with multi-branch support

---

## Architecture

### Frontend Stack
- **Framework:** React 19.2.4 with Vite (build tool)
- **Routing:** React Router DOM 7.9.4
- **HTTP Client:** Axios 1.15.2
- **Dev Tools:** ESLint, Babel, React Compiler
- **Build Command:** `npm run build`
- **Dev Server:** `npm run dev` (runs on localhost:5173)
- **Port:** 5173/5174

### Backend Stack
- **Runtime:** Node.js with ES modules
- **Framework:** Express 5.1.0
- **Database:** MongoDB (Mongoose 8.14.1)
- **Authentication:** JWT (jsonwebtoken 9.0.3)
- **Password Hashing:** bcryptjs 3.0.3
- **CORS:** Enabled for localhost:5173, 5174, and CLIENT_URL env var
- **Port:** 8000 (default, configurable via PORT env var)
- **Dev Server:** `npm run dev` with nodemon

---

## Database Models

### Core Models:
1. **User** - System users (super_admin, admin, console_user)
   - Fields: name, email, password, role, branch, branchId
   - Roles: super_admin, superadmin, admin, console_user

2. **Employee** - Employee records
   - Fields: employeeId, firstName, lastName, email, phone, position, assignedBranch, salaryRate
   - Government IDs: sssId, gsisId, pagibigId, philhealthId
   - Status: active, inactive, resigned, terminated
   - Salary tracking included

3. **Branch** - Business branches
   - Fields: branchName, location, address, status

4. **Payroll** - Payroll management and processing

5. **Plantilla** - Employee plantilla (authorized headcount) management

6. **Attendance** - Employee attendance tracking

7. **Leave** - Employee leave requests and management

8. **Product** - Inventory products

9. **Sale** - Sales transactions

10. **StockIn/StockOut** - Inventory movement tracking

11. **Purchase** - Purchase orders

12. **Feedback** - Employee/customer feedback system

13. **ArchiveEntry** - Historical data archival

14. **NoticeToExplain** - Disciplinary notices

15. **IncidentReport** - Incident reporting

16. **Contribution** - Employee contribution tracking

---

## API Routes & Authentication

### Authentication Endpoints (`/api/auth`)
- Public routes for login/signup
- JWT-based authentication with Bearer token
- Token verification in authMiddleware

### Admin Routes (`/api/admin`) - Branch-Scoped
- `/branches` - Branch management
- `/employees` - Employee management
- `/inventory` - Inventory operations
- `/sales` - Sales management
- `/feedback` - Feedback management
- `/dashboard` - Admin dashboard data
- `/plantilla` - Plantilla management

### SuperAdmin Routes (`/api/superadmin`) - Full Access
- `/branches` - All branches
- `/users` - User management
- `/employees` - All employees
- `/inventory` - All inventory
- `/sales` - All sales
- `/reports` - System reports
- `/dashboard` - Superadmin dashboard
- `/feedback` - All feedback
- `/plantilla` - All plantilla

### Public Routes (`/api/public`)
- `/feedback` - Public feedback submission
- Public endpoints accessible without auth

### Aliases
- `/api/super-admin` → `/api/superadmin` (backward compatibility)
- `/api/super_admin` → `/api/superadmin` (backward compatibility)

---

## Middleware & Security

### Authentication Middleware (`authMiddleware.js`)
- Validates Bearer tokens
- Extracts user info: id, role, branch, branchId
- Populates branchId with branch details (name, location, address, status)
- Returns 401 for invalid/expired tokens

### Role Middleware (`roleMiddleware.js`)
- `allowRoles(...roles)` - Enforces role-based access control
- Role normalization (handles super_admin, superadmin, etc.)
- Returns 403 for insufficient privileges

### Branch Scope Middleware (`branchScopeMiddleware.js`)
- Filters data by user's assigned branch
- Admin users limited to their branch
- SuperAdmin users see all branches

### Access Control Middleware (`accessControl.js`)
- Fine-grained access control implementation

---

## Frontend Structure

### Key Directories:
- `/src/api/` - API integration (authApi.js, axiosInstance.js)
  - `/src/api/admin/` - Admin API calls
  - `/src/api/superadmin/` - SuperAdmin API calls
  - `/src/api/public/` - Public API calls

- `/src/app/` - Core app setup
  - `App.jsx` - Root component
  - `/src/app/routes/` - Route definitions

- `/src/auth/` - Authentication system
  - `/src/auth/context/` - AuthContext for state management
  - `/src/auth/components/` - Login/logout components
  - `/src/auth/pages/` - Auth pages
  - `/src/auth/utils/` - Auth utilities

- `/src/features/` - Feature modules
  - `/src/features/branches/` - Branch management
  - `/src/features/dashboard/` - Dashboard views
  - `/src/features/employees/` - Employee management
  - `/src/features/feedback/` - Feedback system
  - `/src/features/inventory/` - Inventory management
  - `/src/features/plantilla/` - Plantilla management
  - `/src/features/sales/` - Sales management
  - `/src/features/settings/` - User settings
  - `/src/features/users/` - User management (superadmin)

- `/src/layouts/` - Layout components
  - `AdminLayout.jsx` - Admin interface layout
  - Other role-specific layouts

- `/src/shared/` - Shared components and utilities

- `/src/roles/` - Role-based configuration

---

## Backend Utilities

### Logger (`logger.js`)
- Centralized logging system

### Response Handler (`response.js`)
- Standardized API response formatting

### Token Generation (`generateToken.js`)
- JWT token creation

### ID Generator (`idGenerator.js`)
- Unique ID generation for records

### Date Utilities (`date.js`)
- Date formatting and manipulation

### Formatter (`formatter.js`)
- Data formatting utilities

### Branch Filter (`branchFilter.js`)
- Branch-based data filtering

---

## Database Connection

### Configuration (`config/database.js`)
- MongoDB Atlas connection with retry logic
- DNS resolver configuration for network stability
- Multiple connection source support (env vars, DNS servers)
- Server selection timeout: 10000ms
- Retry mechanism with configurable delays
- Connection state monitoring

### Health Check Endpoint
- `GET /api/health` - Returns service and DB connection status
- Status codes: 200 (connected), 503 (disconnected)

---

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 8000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend URL for CORS
- DNS server configuration for MongoDB

### Frontend (.env)
- `VITE_API_URL` - Backend API base URL

---

## Key Features

1. **Multi-Branch Support**
   - Branch-scoped access for admin users
   - Full-access for superadmin users
   - Branch filtering middleware

2. **Role-Based Access Control**
   - Super Admin: Full system access
   - Admin: Branch-scoped access
   - Console User: Limited branch access

3. **Employee Management**
   - Complete employee records
   - Government ID tracking
   - Employment status tracking
   - Salary rate management

4. **Payroll & Plantilla**
   - Payroll processing
   - Authorized headcount management
   - Attendance and leave tracking

5. **Inventory Management**
   - Product tracking
   - Stock-in/Stock-out operations
   - Purchase order management

6. **Sales Management**
   - Sales transaction recording
   - Sales reporting

7. **HR Features**
   - Feedback system
   - Incident reporting
   - Disciplinary notices
   - Leave management
   - Attendance tracking

8. **Reporting & Analytics**
   - Dashboard views for admin and superadmin
   - System reports

---

## Development Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (hot reload)
- `npm run seed:plantilla` - Seed plantilla data
- `npm test` - Run tests (not configured)

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

## Default Credentials

**SuperAdmin Account:**
- Email: superadmin@ally.local
- Password: 12345678

**Console User Account:**
- Email: jamessandayan17@gmail.com
- Password: #Akosijames2003

---

## Technology Stack Summary

| Category | Technology |
|----------|-----------|
| Backend Runtime | Node.js (ES modules) |
| Web Framework | Express 5.1.0 |
| Database | MongoDB + Mongoose 8.14.1 |
| Authentication | JWT + bcryptjs |
| Frontend Library | React 19.2.4 |
| Build Tool | Vite 8.0.4 |
| Routing | React Router 7.9.4 |
| HTTP Client | Axios 1.15.2 |
| API Format | RESTful JSON |
| CORS | Enabled for localhost & CLIENT_URL |

---

## Project File Structure

```
Operations-Monitoring-System/
├── Credentials.txt (auth details)
├── Backend/
│   ├── index.js (main entry point)
│   ├── package.json
│   ├── Readme.md
│   ├── config/
│   │   └── database.js (MongoDB connection)
│   ├── controllers/ (API logic by feature)
│   │   ├── auth/
│   │   ├── branches/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── feedback/
│   │   ├── hr/
│   │   ├── inventory/
│   │   ├── sales/
│   │   └── users/
│   ├── middleware/ (auth, roles, branch scope)
│   ├── models/ (MongoDB schemas - 17 models)
│   ├── routes/ (API endpoints)
│   │   ├── admin/ (branch-scoped)
│   │   ├── public/ (unauthenticated)
│   │   └── superadmin/ (full access)
│   └── utils/ (helpers & utilities)
│
└── Client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── api/ (Axios API integrations)
    │   ├── app/ (App root & routing)
    │   ├── auth/ (Authentication context & pages)
    │   ├── features/ (Feature modules by domain)
    │   ├── layouts/ (Layout components)
    │   ├── roles/ (Role configurations)
    │   ├── shared/ (Shared components)
    │   ├── styles/ (CSS/styling)
    │   └── main.jsx (React entry point)
    └── public/
```

---

## API Response Format

Standard JSON responses with structured format:
```json
{
  "success": true/false,
  "data": {},
  "message": "Status message",
  "error": "Error details (if applicable)"
}
```

Health check example:
```json
{
  "success": true,
  "service": "operations-monitoring-api",
  "db": "connected"
}
```

---

## Notes for Development

1. **JWT Authentication**: All protected endpoints require `Authorization: Bearer <token>` header
2. **Branch Scoping**: Admin users automatically filtered by their branch; superadmin sees all
3. **CORS Configured**: localhost:5173, localhost:5174, and CLIENT_URL env variable
4. **Database Retries**: Connection includes retry logic for network stability
5. **Role Normalization**: Roles normalized to lowercase with underscore handling
6. **ESM Modules**: Backend uses ES modules (`import/export`)
7. **Timestamps**: Models include createdAt/updatedAt tracking

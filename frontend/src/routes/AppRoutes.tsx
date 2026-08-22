import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { LandingPage } from "../pages/landing/LandingPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";

import { EmployeeDashboard } from "../pages/dashboard/EmployeeDashboard";
import { AdminDashboard } from "../pages/dashboard/AdminDashboard";

import { EmployeeDirectoryPage } from "../pages/employees/EmployeeDirectoryPage";
import { EmployeeDetailPage } from "../pages/employees/EmployeeDetailPage";
import { MyProfilePage } from "../pages/employees/MyProfilePage";

import { AttendanceDashboardPage } from "../pages/attendance/AttendanceDashboardPage";
import { AdminAttendancePage } from "../pages/attendance/AdminAttendancePage";

import { EmployeeLeavePage } from "../pages/leave/EmployeeLeavePage";
import { AdminLeavePage } from "../pages/leave/AdminLeavePage";

import { EmployeeSalaryPage } from "../pages/payroll/EmployeeSalaryPage";
import { AdminPayrollPage } from "../pages/payroll/AdminPayrollPage";

import { ProtectedRoute } from "../components/common/ProtectedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <MyProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <MyProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <AttendanceDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance/today"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <AttendanceDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance/week"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <AttendanceDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <EmployeeLeavePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salary"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
            <EmployeeSalaryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <EmployeeDirectoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <EmployeeDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leave"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLeavePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPayrollPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/attendance/admin"
        element={<Navigate to="/admin/attendance" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

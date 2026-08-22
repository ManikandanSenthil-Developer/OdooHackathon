import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { SignupPage } from '../pages/SignupPage';
import { LoginPage } from '../pages/LoginPage';
import { EmployeeDashboard } from '../pages/EmployeeDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Employee Dashboard Route */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Dashboard Route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

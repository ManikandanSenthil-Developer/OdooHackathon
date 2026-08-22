import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LeavePage } from '../pages/employee/LeavePage';
import { SalaryPage } from '../pages/employee/SalaryPage';
import { AdminLeavePage } from '../pages/admin/AdminLeavePage';
import { AdminPayrollPage } from '../pages/admin/AdminPayrollPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leave" replace />} />
      <Route path="/leave" element={<LeavePage />} />
      <Route path="/salary" element={<SalaryPage />} />
      <Route path="/admin/leave" element={<AdminLeavePage />} />
      <Route path="/admin/payroll" element={<AdminPayrollPage />} />
      <Route path="*" element={<Navigate to="/leave" replace />} />
    </Routes>
  );
};

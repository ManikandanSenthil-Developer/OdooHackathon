import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MyProfile from './pages/MyProfile';
import EditProfile from './pages/EditProfile';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import AdminEmployeeManagement from './pages/AdminEmployeeManagement';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-[#00ABE4]/20 selection:text-[#007EA7]">
          {/* Main Module 2 Navigation Bar */}
          <Navbar />

          {/* Page Routing */}
          <main className="flex-1 pb-16">
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/profile" replace />} />

              {/* Employee Routes (Section 7, 8, 9, 10, 11, 12, 13) */}
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/profile/edit" element={<EditProfile />} />

              {/* Admin Routes (Section 14, 15, 16, 17, 18, 19) */}
              <Route path="/admin/employees" element={<EmployeeDirectory />} />
              <Route path="/admin/employees/new" element={<AdminEmployeeManagement />} />
              <Route path="/admin/employees/:employeeId" element={<EmployeeDetailsPage />} />
              <Route path="/admin/employees/:employeeId/edit" element={<AdminEmployeeManagement />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Routes>
          </main>

          {/* Clean minimal footer */}
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© 2026 Dayflow HRMS • Module 2: Employee Profile & Management</p>
              <div className="flex items-center gap-4 text-slate-400">
                <span>React 19 & Vite</span>
                <span>•</span>
                <span>Modular Micro-Frontend Architecture</span>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

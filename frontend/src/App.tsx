import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-brand-500/20 selection:text-brand-700">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content Viewport */}
            <main className="flex-1 pb-16">
              <AppRoutes />
            </main>

            {/* Clean Enterprise Footer */}
            <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="font-semibold text-slate-600">
                  © 2026 Dayflow HRMS Platform • Unified Workforce Suite
                </p>
                <div className="flex items-center gap-4 text-slate-400">
                  <span>React 18 & Vite</span>
                  <span>•</span>
                  <span>TypeScript & Tailwind</span>
                  <span>•</span>
                  <span>Prisma ORM & MySQL</span>
                </div>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;


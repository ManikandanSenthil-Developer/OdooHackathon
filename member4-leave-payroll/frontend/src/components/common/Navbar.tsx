import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, DollarSign, Shield, ShieldCheck, UserCheck, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>(
    (localStorage.getItem('dayflow_dev_role') as 'EMPLOYEE' | 'ADMIN') || 'EMPLOYEE'
  );

  useEffect(() => {
    localStorage.setItem('dayflow_dev_role', role);
  }, [role]);

  const toggleRole = () => {
    const nextRole = role === 'EMPLOYEE' ? 'ADMIN' : 'EMPLOYEE';
    setRole(nextRole);
    localStorage.setItem('dayflow_dev_role', nextRole);
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-bold text-lg tracking-tight">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Dayflow HRMS</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-brand-100/70 text-brand-700 border border-brand-200">
                  Module 4
                </span>
              </div>
              <p className="text-[12px] text-slate-500 hidden sm:block">Leave & Payroll Management</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/leave"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/leave')
                  ? 'bg-brand-50 text-brand-600 font-semibold shadow-xs border border-brand-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>My Leaves</span>
            </Link>

            <Link
              to="/salary"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/salary')
                  ? 'bg-brand-50 text-brand-600 font-semibold shadow-xs border border-brand-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>My Salary</span>
            </Link>

            <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            <Link
              to="/admin/leave"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/admin/leave')
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-brand-400" />
              <span className="hidden md:inline">Admin</span> Leave
            </Link>

            <Link
              to="/admin/payroll"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/admin/payroll')
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Admin</span> Payroll
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRole}
              title="Toggle role perspective for local module testing"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
            >
              {role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span className="text-slate-800">HR Admin View</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-800">Employee View</span>
                </>
              )}
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1 uppercase">
                Toggle
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

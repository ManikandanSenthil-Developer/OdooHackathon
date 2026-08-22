import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { User, Users, UserPlus, Shield, Sparkles, Building2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, switchRole } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" id="dayflow-navbar">
      {/* Top Integration & Module Indicator Bar */}
      <div className="bg-[#E9F1FA] border-b border-[#00ABE4]/20 px-4 py-1.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#007EA7] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            DAYFLOW HRMS
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">Module 2: Employee Profile & Management</span>
        </div>

        {/* Member 1 Auth State Switcher (Evaluation Bridge) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline">Active Role Context:</span>
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => switchRole('employee')}
              className={`px-2.5 py-0.5 text-xs rounded-md font-medium transition-all ${
                !isAdmin
                  ? 'bg-[#00ABE4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="switch-to-employee-btn"
            >
              Employee (EMP-1001)
            </button>
            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-0.5 text-xs rounded-md font-medium transition-all ${
                isAdmin
                  ? 'bg-[#00ABE4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="switch-to-admin-btn"
            >
              Admin (EMP-1003)
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/profile" className="flex items-center gap-2.5 group shrink-0" id="brand-logo-link">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ABE4] to-[#0096ca] flex items-center justify-center text-white shadow-sm shadow-[#00ABE4]/25">
            <span className="font-bold text-base tracking-wider">DF</span>
          </div>
          <div>
            <div className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-[#00ABE4] transition-colors">
              DAYFLOW
            </div>
            <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">HRMS</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Employee Link */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive && !location.pathname.startsWith('/admin')
                  ? 'bg-[#E9F1FA] text-[#007EA7] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
            id="nav-my-profile"
          >
            <User className="w-4 h-4 text-[#00ABE4]" />
            <span>My Profile</span>
          </NavLink>

          {/* Admin Directory Link */}
          <NavLink
            to="/admin/employees"
            end={location.pathname === '/admin/employees'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === '/admin/employees' || location.pathname.startsWith('/admin/employees/EMP')
                  ? 'bg-[#E9F1FA] text-[#007EA7] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
            id="nav-employee-directory"
          >
            <Users className="w-4 h-4 text-[#00ABE4]" />
            <span className="hidden sm:inline">Employee Directory</span>
            <span className="sm:hidden">Directory</span>
          </NavLink>

          {/* Admin Add Employee Link */}
          <NavLink
            to="/admin/employees/new"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#00ABE4] text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:text-[#00ABE4] hover:bg-[#E9F1FA]'
              }`
            }
            id="nav-add-employee"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </NavLink>
        </nav>

        {/* User Badge Profile Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors"
            id="user-profile-badge"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#E9F1FA] text-[#00ABE4] text-xs font-semibold flex items-center justify-center border border-slate-200">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{user?.name?.slice(0, 2).toUpperCase() || 'DF'}</span>
              )}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</div>
              <div className="text-[10px] font-mono text-slate-400">{user?.employeeId}</div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

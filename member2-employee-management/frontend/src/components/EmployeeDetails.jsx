import React from 'react';
import { User, Briefcase, DollarSign, Lock, Edit3, ShieldAlert, Calendar, Building, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/validation';
import { Link } from 'react-router-dom';

export default function EmployeeDetails({
  employee,
  isOwnProfile = false,
  isAdminView = false
}) {
  if (!employee) return null;

  const address = employee.address || {};
  const formattedAddress = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country
  ].filter(Boolean).join(', ') || 'No address provided';

  const salary = employee.salary || {
    basic: 0,
    hra: 0,
    specialAllowance: 0,
    conveyance: 0,
    medicalAllowance: 0,
    grossSalary: 0,
    currency: 'USD',
    payFrequency: 'MONTHLY'
  };

  return (
    <div className="space-y-6" id="employee-details-container">
      {/* 1. PERSONAL INFORMATION CARD */}
      <div className="dayflow-card p-6 md:p-7 bg-white" id="personal-info-card">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Contact details and residential address</p>
            </div>
          </div>

          {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="text-xs font-medium text-[#00ABE4] hover:text-[#0096ca] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#E9F1FA] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Editable Fields</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee ID - Read Only */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span>Employee ID</span>
              <span className="inline-flex items-center text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Read-only
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 font-mono">{employee.employeeId}</p>
          </div>

          {/* Full Name - Read Only for employee */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span>Full Name</span>
              {isOwnProfile && (
                <span className="inline-flex items-center text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  <Lock className="w-2.5 h-2.5 mr-0.5" /> Read-only
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900">{employee.fullName}</p>
          </div>

          {/* Email - Read Only for employee */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
              {isOwnProfile && (
                <span className="inline-flex items-center text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  <Lock className="w-2.5 h-2.5 mr-0.5" /> Read-only
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900 break-all">{employee.email}</p>
          </div>

          {/* Phone - Editable by Employee */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Number</span>
              {isOwnProfile && (
                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Editable
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900">{employee.phone || '—'}</p>
          </div>

          {/* Address - Editable by Employee */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>Residential Address</span>
              {isOwnProfile && (
                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Editable
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">{formattedAddress}</p>
          </div>

          {/* Emergency Contact */}
          {employee.emergencyContact && employee.emergencyContact.name && (
            <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <span className="font-semibold text-slate-600">Emergency Contact:</span>
              <span className="text-slate-800 font-medium">{employee.emergencyContact.name} ({employee.emergencyContact.relationship})</span>
              <span className="text-slate-500">{employee.emergencyContact.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. JOB INFORMATION CARD */}
      <div className="dayflow-card p-6 md:p-7 bg-white" id="job-info-card">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Job Information</h2>
              <p className="text-xs text-slate-500">Role, department, and employment timeline</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <Lock className="w-3 h-3 text-slate-400" />
            Admin Managed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Building className="w-3.5 h-3.5" />
              <span>Department</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{employee.department}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Designation</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{employee.designation}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joining Date</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{formatDate(employee.joiningDate)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>Work Location</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{employee.workLocation || 'Main HQ'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Employment Type</span>
            </div>
            <p className="text-sm font-medium text-slate-900">
              {employee.employmentType ? employee.employmentType.replace('_', ' ') : 'Full Time'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span>Status</span>
            </div>
            <p className="text-sm font-medium text-slate-900 capitalize">
              {employee.status ? employee.status.toLowerCase().replace('_', ' ') : 'Active'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. SALARY STRUCTURE CARD */}
      <div className="dayflow-card p-6 md:p-7 bg-white" id="salary-structure-card">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Salary Structure</h2>
              <p className="text-xs text-slate-500">Compensation breakdown (Read-only view for Module 4 Payroll)</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <Lock className="w-3 h-3 text-slate-400" />
            Read Only
          </span>
        </div>

        {/* Salary breakdown grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <span className="text-xs font-medium text-slate-500">Basic Pay</span>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency(salary.basic, salary.currency)}
            </p>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <span className="text-xs font-medium text-slate-500">HRA Allowance</span>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency(salary.hra, salary.currency)}
            </p>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <span className="text-xs font-medium text-slate-500">Special Allowance</span>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency(salary.specialAllowance, salary.currency)}
            </p>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <span className="text-xs font-medium text-slate-500">Conveyance / Misc</span>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency((salary.conveyance || 0) + (salary.medicalAllowance || 0), salary.currency)}
            </p>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>
        </div>

        {/* Gross Total Banner */}
        <div className="p-4 rounded-xl bg-[#E9F1FA]/60 border border-[#00ABE4]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#007EA7] uppercase tracking-wider">Gross Monthly Salary</span>
            <p className="text-xs text-slate-600">Calculated sum before payroll deductions by Module 4</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xl sm:text-2xl font-bold text-slate-900" id="gross-salary-amount">
              {formatCurrency(salary.grossSalary || (salary.basic + salary.hra + salary.specialAllowance + (salary.conveyance || 0)), salary.currency)}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">/ month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

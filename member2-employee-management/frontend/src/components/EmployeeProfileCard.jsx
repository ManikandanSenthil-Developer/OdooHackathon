import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Briefcase, Edit3, ShieldCheck, UserCheck } from 'lucide-react';
import ProfilePicture from './ProfilePicture';
import StatusBadge from './StatusBadge';

export default function EmployeeProfileCard({
  employee,
  isOwnProfile = false,
  isAdminView = false,
  onEditClick
}) {
  if (!employee) return null;

  return (
    <div
      className="dayflow-card p-6 md:p-8 bg-white border border-slate-200"
      id="employee-profile-header-card"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Left Side: Avatar + Main Titles */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left w-full md:w-auto">
          <ProfilePicture
            avatarUrl={employee.avatarUrl}
            fullName={employee.fullName}
            size="lg"
            isEditable={false}
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight" id="employee-profile-name">
                {employee.fullName}
              </h1>
              <StatusBadge status={employee.status} />
              {isAdminView && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-[#00ABE4]" />
                  Admin Managed
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="font-semibold text-[#00ABE4]" id="employee-profile-id">
                {employee.employeeId}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="font-medium text-slate-800" id="employee-profile-designation">
                {employee.designation}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-slate-600" id="employee-profile-department">
                {employee.department}
              </span>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-slate-500">
              {employee.email && (
                <a
                  href={`mailto:${employee.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#00ABE4] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.email}</span>
                </a>
              )}
              {employee.phone && (
                <a
                  href={`tel:${employee.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#00ABE4] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.phone}</span>
                </a>
              )}
              {employee.address?.city && (
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.address.city}, {employee.address.country}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="btn-primary inline-flex items-center gap-2"
              id="header-edit-profile-btn"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          )}

          {isAdminView && (
            <Link
              to={`/admin/employees/${employee.employeeId}/edit`}
              className="btn-primary inline-flex items-center gap-2"
              id="admin-edit-employee-btn"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Employee</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

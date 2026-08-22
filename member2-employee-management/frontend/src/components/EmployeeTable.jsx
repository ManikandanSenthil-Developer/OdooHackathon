import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, FileText, ChevronLeft, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/validation';
import { TableSkeletonLoader } from './LoadingState';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';

export default function EmployeeTable({
  employees = [],
  isLoading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onDeleteEmployee
}) {
  const safeEmployees = Array.isArray(employees)
    ? employees
    : Array.isArray(employees?.data)
    ? employees.data
    : [];

  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete || !onDeleteEmployee) return;
    setIsDeleting(true);
    try {
      await onDeleteEmployee(employeeToDelete.employeeId);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error('Delete employee failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <TableSkeletonLoader rows={6} />;
  }

  if (safeEmployees.length === 0) {
    return (
      <EmptyState
        iconType="search"
        title="No employees found"
        description="Try adjusting your search terms or filter selections to find what you're looking for."
      />
    );
  }

  return (
    <div className="space-y-4" id="employee-directory-table-container">
      {/* 1. DESKTOP / TABLET TABLE VIEW */}
      <div className="dayflow-card overflow-hidden bg-white border border-slate-200 shadow-xs hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="admin-employee-table">
            <thead>
              <tr className="bg-slate-50/90 text-[12px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 w-12 text-center">Avatar</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Joining Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {safeEmployees.map((emp) => (
                <tr
                  key={emp.id || emp.employeeId}
                  id={`employee-row-${emp.employeeId}`}
                  className="hover:bg-[#F8FAFC] transition-colors group"
                >
                  {/* Avatar */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#E9F1FA] text-[#00ABE4] font-semibold text-xs flex items-center justify-center overflow-hidden shrink-0 mx-auto border border-slate-100">
                      {emp.avatarUrl ? (
                        <img
                          src={emp.avatarUrl}
                          alt={emp.fullName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{emp.fullName?.slice(0, 2).toUpperCase() || 'DF'}</span>
                      )}
                    </div>
                  </td>

                  {/* Employee Name & Email */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 leading-snug">
                      <Link
                        to={`/admin/employees/${emp.employeeId}`}
                        className="hover:text-[#00ABE4] transition-colors"
                      >
                        {emp.fullName}
                      </Link>
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{emp.email}</div>
                  </td>

                  {/* Employee ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-xs text-[#007EA7]">
                    {emp.employeeId}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {emp.department}
                  </td>

                  {/* Designation */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {emp.designation}
                  </td>

                  {/* Joining Date */}
                  <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                    {formatDate(emp.joiningDate)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={emp.status} />
                  </td>

                  {/* Actions: View, Edit, Documents */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/employees/${emp.employeeId}`}
                        className="p-1.5 text-slate-500 hover:text-[#00ABE4] hover:bg-[#E9F1FA] rounded-lg transition-colors"
                        title="View Profile"
                        aria-label={`View ${emp.fullName}`}
                        id={`view-emp-btn-${emp.employeeId}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/employees/${emp.employeeId}/edit`}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Details"
                        aria-label={`Edit ${emp.fullName}`}
                        id={`edit-emp-btn-${emp.employeeId}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/employees/${emp.employeeId}?tab=documents`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Manage Documents"
                        aria-label={`Documents for ${emp.fullName}`}
                        id={`docs-emp-btn-${emp.employeeId}`}
                      >
                        <FileText className="w-4 h-4" />
                      </Link>

                      {onDeleteEmployee && (
                        <button
                          type="button"
                          onClick={() => setEmployeeToDelete(emp)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                          aria-label={`Delete ${emp.fullName}`}
                          id={`delete-emp-btn-${emp.employeeId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. MOBILE RESPONSIVE CARD VIEW (Clean transformation as specified in Section 15) */}
      <div className="grid grid-cols-1 gap-3 md:hidden" id="mobile-employee-cards">
        {safeEmployees.map((emp) => (
          <div
            key={emp.id || emp.employeeId}
            className="dayflow-card p-4 space-y-3 bg-white"
            id={`mobile-card-${emp.employeeId}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#E9F1FA] text-[#00ABE4] font-semibold text-sm flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                  {emp.avatarUrl ? (
                    <img
                      src={emp.avatarUrl}
                      alt={emp.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{emp.fullName?.slice(0, 2).toUpperCase() || 'DF'}</span>
                  )}
                </div>
                <div>
                  <Link
                    to={`/admin/employees/${emp.employeeId}`}
                    className="font-semibold text-slate-900 text-sm hover:text-[#00ABE4]"
                  >
                    {emp.fullName}
                  </Link>
                  <p className="text-xs text-slate-400">{emp.email}</p>
                </div>
              </div>
              <StatusBadge status={emp.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Employee ID</span>
                <span className="font-mono font-semibold text-[#007EA7]">{emp.employeeId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Department</span>
                <span className="font-medium text-slate-700">{emp.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Designation</span>
                <span className="text-slate-700">{emp.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Joined</span>
                <span className="text-slate-600">{formatDate(emp.joiningDate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Link
                to={`/admin/employees/${emp.employeeId}`}
                className="btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>
              <Link
                to={`/admin/employees/${emp.employeeId}/edit`}
                className="btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <Link
                to={`/admin/employees/${emp.employeeId}?tab=documents`}
                className="btn-secondary text-xs px-2.5 py-1.5 inline-flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Docs</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 3. PAGINATION BAR */}
      <div
        className="dayflow-card p-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500"
        id="table-pagination-bar"
      >
        <div>
          Showing <span className="font-semibold text-slate-800">{employees.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalCount}</span> employees
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
            id="pagination-prev-btn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-medium text-slate-700">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
            id="pagination-next-btn"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!employeeToDelete}
        title="Delete Employee"
        message={`Are you sure you want to remove ${employeeToDelete?.fullName} (${employeeToDelete?.employeeId}) from Dayflow?`}
        confirmLabel="Delete Employee"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </div>
  );
}

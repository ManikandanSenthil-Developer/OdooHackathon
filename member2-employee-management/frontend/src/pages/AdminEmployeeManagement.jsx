import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Edit3, ShieldCheck } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployee } from '../hooks/useEmployee';
import { createEmployee } from '../services/employeeApi';
import { ProfileSkeletonLoader } from '../components/LoadingState';
import Toast from '../components/Toast';

export default function AdminEmployeeManagement() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(employeeId);

  const { employee, loading, error, saveEmployeeAdmin } = useEmployee(isEdit ? employeeId : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        const result = await saveEmployeeAdmin(formData);
        if (!result.success) throw new Error(result.error);
        setToast({ type: 'success', message: 'Employee updated successfully.' });
        setTimeout(() => {
          navigate(`/admin/employees/${employeeId}`);
        }, 1000);
      } else {
        const created = await createEmployee(formData);
        setToast({ type: 'success', message: `Employee ${created.fullName} (${created.employeeId}) created successfully!` });
        setTimeout(() => {
          navigate(`/admin/employees/${created.employeeId}`);
        }, 1200);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save employee record.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <ProfileSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200" id="admin-employee-management-page">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            to={isEdit ? `/admin/employees/${employeeId}` : '/admin/employees'}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#00ABE4] transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEdit ? 'Back to Employee Details' : 'Back to Directory'}</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight" id="form-page-title">
              {isEdit ? `Edit Employee: ${employee?.fullName || employeeId}` : 'Add New Employee'}
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#E9F1FA] text-[#007EA7] border border-[#00ABE4]/20 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin Mode
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isEdit
              ? 'Update complete employment, compensation, and profile records.'
              : 'Onboard a new employee to Dayflow HRMS with role and salary structure.'}
          </p>
        </div>
      </div>

      {/* Reusable Admin Employee Form */}
      <EmployeeForm
        initialData={isEdit ? employee : null}
        isEdit={isEdit}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

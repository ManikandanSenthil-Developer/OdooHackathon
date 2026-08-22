import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, DollarSign, Image as ImageIcon, Save, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import ProfilePicture from './ProfilePicture';
import { validateEmail, validatePhone, validateRequired, validateNumber } from '../utils/validation';

const DEPARTMENTS = ['Engineering', 'Design', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Product', 'Sales'];
const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' }
];
const STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_LEAVE', label: 'On Leave' },
  { value: 'PROBATION', label: 'Probation' },
  { value: 'TERMINATED', label: 'Inactive / Terminated' }
];

export default function EmployeeForm({
  initialData = null,
  isEdit = false,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: initialData?.employeeId || '',
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    avatarUrl: initialData?.avatarUrl || '',
    department: initialData?.department || 'Engineering',
    designation: initialData?.designation || '',
    joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'ACTIVE',
    workLocation: initialData?.workLocation || 'Main Office',
    employmentType: initialData?.employmentType || 'FULL_TIME',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || '',
      postalCode: initialData?.address?.postalCode || '',
      country: initialData?.address?.country || 'United States'
    },
    salary: {
      basic: initialData?.salary?.basic || 7000,
      hra: initialData?.salary?.hra || 2000,
      specialAllowance: initialData?.salary?.specialAllowance || 1000,
      conveyance: initialData?.salary?.conveyance || 500,
      medicalAllowance: initialData?.salary?.medicalAllowance || 300,
      grossSalary: initialData?.salary?.grossSalary || 10800,
      currency: initialData?.salary?.currency || 'USD',
      payFrequency: 'MONTHLY'
    }
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Field change handlers
  const handleTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleSalaryChange = (field, value) => {
    const num = parseFloat(value) || 0;
    setFormData((prev) => {
      const updatedSalary = { ...prev.salary, [field]: num };
      // Auto calculate gross
      updatedSalary.grossSalary =
        (updatedSalary.basic || 0) +
        (updatedSalary.hra || 0) +
        (updatedSalary.specialAllowance || 0) +
        (updatedSalary.conveyance || 0) +
        (updatedSalary.medicalAllowance || 0);
      return { ...prev, salary: updatedSalary };
    });
  };

  const handleAvatarFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};

    if (!isEdit && !formData.employeeId?.trim()) {
      newErrors.employeeId = 'Employee ID is required (e.g. EMP-1008)';
    }
    const nameErr = validateRequired(formData.fullName, 'Full name');
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const desigErr = validateRequired(formData.designation, 'Designation');
    if (desigErr) newErrors.designation = desigErr;

    const salaryErr = validateNumber(formData.salary.basic, 'Basic salary', 1);
    if (salaryErr) newErrors.salaryBasic = salaryErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      setGeneralError('Please fix the validation errors below before saving.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setGeneralError(err.message || 'Failed to save employee. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="admin-employee-form">
      {/* General Error Banner */}
      {generalError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{generalError}</span>
        </div>
      )}

      {/* 1. PERSONAL INFORMATION */}
      <div className="dayflow-card p-6 md:p-7 bg-white space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">Identity, contact details, and photo</p>
          </div>
        </div>

        {/* Profile Picture Uploader */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2 pb-4">
          <ProfilePicture
            avatarUrl={formData.avatarUrl}
            fullName={formData.fullName || 'Employee'}
            size="lg"
            isEditable={true}
            onImageChange={handleAvatarFile}
            onImageRemove={() => setFormData((prev) => ({ ...prev, avatarUrl: '' }))}
          />
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-800">Profile Photo</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Upload a clear headshot. Accepted formats: JPG, PNG, WEBP (Max 5MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-fullname">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-fullname"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleTextChange('fullName', e.target.value)}
              placeholder="e.g. John Doe"
              className={`dayflow-input w-full ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
              required
            />
            {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-email">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleTextChange('email', e.target.value)}
              placeholder="e.g. john.doe@dayflow.com"
              className={`dayflow-input w-full ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              required
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-phone">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-phone"
              type="text"
              value={formData.phone}
              onChange={(e) => handleTextChange('phone', e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className={`dayflow-input w-full ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
              required
            />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
          </div>

          {/* Street Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-street">
              Street Address
            </label>
            <input
              id="emp-street"
              type="text"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace"
              className="dayflow-input w-full"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-city">
              City
            </label>
            <input
              id="emp-city"
              type="text"
              value={formData.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="e.g. San Francisco"
              className="dayflow-input w-full"
            />
          </div>

          {/* State / Province */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-state">
              State / Province
            </label>
            <input
              id="emp-state"
              type="text"
              value={formData.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="e.g. CA"
              className="dayflow-input w-full"
            />
          </div>

          {/* Postal Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-postal">
              Postal Code
            </label>
            <input
              id="emp-postal"
              type="text"
              value={formData.address.postalCode}
              onChange={(e) => handleAddressChange('postalCode', e.target.value)}
              placeholder="e.g. 94107"
              className="dayflow-input w-full"
            />
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-country">
              Country
            </label>
            <input
              id="emp-country"
              type="text"
              value={formData.address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="e.g. United States"
              className="dayflow-input w-full"
            />
          </div>
        </div>
      </div>

      {/* 2. EMPLOYMENT INFORMATION */}
      <div className="dayflow-card p-6 md:p-7 bg-white space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Employment Information</h3>
            <p className="text-xs text-slate-500">Role assignment, department, and work parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-id-input">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-id-input"
              type="text"
              disabled={isEdit}
              value={formData.employeeId}
              onChange={(e) => handleTextChange('employeeId', e.target.value)}
              placeholder="e.g. EMP-1008"
              className={`dayflow-input w-full font-mono ${errors.employeeId ? 'border-red-500' : ''}`}
              required
            />
            {errors.employeeId && <p className="text-xs text-red-600">{errors.employeeId}</p>}
            {isEdit && <p className="text-[11px] text-slate-400">Employee ID is permanently assigned</p>}
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-designation">
              Designation / Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-designation"
              type="text"
              value={formData.designation}
              onChange={(e) => handleTextChange('designation', e.target.value)}
              placeholder="e.g. Lead Frontend Engineer"
              className={`dayflow-input w-full ${errors.designation ? 'border-red-500' : ''}`}
              required
            />
            {errors.designation && <p className="text-xs text-red-600">{errors.designation}</p>}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-dept">
              Department
            </label>
            <select
              id="emp-dept"
              value={formData.department}
              onChange={(e) => handleTextChange('department', e.target.value)}
              className="dayflow-input w-full"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Joining Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-joining-date">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-joining-date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => handleTextChange('joiningDate', e.target.value)}
              className="dayflow-input w-full"
              required
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-type">
              Employment Type
            </label>
            <select
              id="emp-type"
              value={formData.employmentType}
              onChange={(e) => handleTextChange('employmentType', e.target.value)}
              className="dayflow-input w-full"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-status">
              Employment Status
            </label>
            <select
              id="emp-status"
              value={formData.status}
              onChange={(e) => handleTextChange('status', e.target.value)}
              className="dayflow-input w-full"
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Work Location */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-location">
              Work Location / Office
            </label>
            <input
              id="emp-location"
              type="text"
              value={formData.workLocation}
              onChange={(e) => handleTextChange('workLocation', e.target.value)}
              placeholder="e.g. San Francisco HQ (Hybrid)"
              className="dayflow-input w-full"
            />
          </div>
        </div>
      </div>

      {/* 3. COMPENSATION / SALARY (Module 2 Structure) */}
      <div className="dayflow-card p-6 md:p-7 bg-white space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Compensation Details</h3>
            <p className="text-xs text-slate-500">Base salary structure consumed by Payroll (Module 4)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Basic Monthly Salary */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-salary-basic">
              Basic Salary ($ / mo) <span className="text-red-500">*</span>
            </label>
            <input
              id="emp-salary-basic"
              type="number"
              min="0"
              step="50"
              value={formData.salary.basic}
              onChange={(e) => handleSalaryChange('basic', e.target.value)}
              className={`dayflow-input w-full ${errors.salaryBasic ? 'border-red-500' : ''}`}
              required
            />
            {errors.salaryBasic && <p className="text-xs text-red-600">{errors.salaryBasic}</p>}
          </div>

          {/* HRA */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-salary-hra">
              HRA Allowance ($ / mo)
            </label>
            <input
              id="emp-salary-hra"
              type="number"
              min="0"
              step="50"
              value={formData.salary.hra}
              onChange={(e) => handleSalaryChange('hra', e.target.value)}
              className="dayflow-input w-full"
            />
          </div>

          {/* Special Allowance */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="emp-salary-special">
              Special Allowance ($ / mo)
            </label>
            <input
              id="emp-salary-special"
              type="number"
              min="0"
              step="50"
              value={formData.salary.specialAllowance}
              onChange={(e) => handleSalaryChange('specialAllowance', e.target.value)}
              className="dayflow-input w-full"
            />
          </div>
        </div>

        {/* Total Summary Banner */}
        <div className="p-4 rounded-xl bg-[#E9F1FA] text-[#007EA7] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider">Calculated Monthly Gross</span>
          <span className="text-lg font-bold text-slate-900" id="form-gross-salary">
            ${Number(formData.salary.grossSalary || 0).toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ month</span>
          </span>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary text-sm px-4 py-2.5 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
          id="save-employee-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Employee...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Update Employee Details' : 'Create Employee Record'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

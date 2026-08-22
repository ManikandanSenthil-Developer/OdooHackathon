import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, Lock, Save, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmployee } from '../hooks/useEmployee';
import ProfilePicture from '../components/ProfilePicture';
import { validatePhone } from '../utils/validation';
import { ProfileSkeletonLoader } from '../components/LoadingState';
import Toast from '../components/Toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const { employeeId } = useAuth();
  const { employee, loading, error, isUpdating, saveMyProfile } = useEmployee(employeeId);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phoneError, setPhoneError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Sync state once employee loads
  useEffect(() => {
    if (employee) {
      setPhone(employee.phone || '');
      setAddress({
        street: employee.address?.street || '',
        city: employee.address?.city || '',
        state: employee.address?.state || '',
        postalCode: employee.address?.postalCode || '',
        country: employee.address?.country || 'United States'
      });
      setAvatarUrl(employee.avatarUrl || '');
    }
  }, [employee]);

  const handleAvatarFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhoneError(null);
    setFeedback(null);

    // Validate phone
    const phoneValidationErr = validatePhone(phone);
    if (phoneValidationErr) {
      setPhoneError(phoneValidationErr);
      return;
    }

    const result = await saveMyProfile({
      phone: phone.trim(),
      address,
      avatarUrl
    });

    if (result.success) {
      setFeedback({ type: 'success', message: 'Your profile has been updated successfully.' });
      setTimeout(() => {
        navigate('/profile');
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to save changes.' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <ProfileSkeletonLoader />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-medium">{error || 'Employee not found.'}</p>
        <Link to="/profile" className="btn-secondary mt-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="edit-profile-page">
      {/* Toast Notification */}
      <Toast toast={feedback} onClose={() => setFeedback(null)} />

      {/* Header breadcrumb & title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#00ABE4] transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="text-xs text-slate-500">
            Update your contact phone number, residential address, and profile photo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" id="edit-profile-form">
        {/* 1. PROFILE PHOTO SECTION */}
        <div className="dayflow-card p-6 md:p-7 bg-white">
          <h2 className="text-sm font-semibold text-slate-900 pb-3 mb-4 border-b border-slate-100">
            Profile Picture
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ProfilePicture
              avatarUrl={avatarUrl}
              fullName={employee.fullName}
              size="lg"
              isEditable={true}
              onImageChange={handleAvatarFile}
              onImageRemove={() => setAvatarUrl('')}
            />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-800">Your Avatar Photo</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload a professional photo (JPG, PNG, WEBP). Recommended size: 400x400px.
              </p>
            </div>
          </div>
        </div>

        {/* 2. EDITABLE CONTACT DETAILS */}
        <div className="dayflow-card p-6 md:p-7 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Editable Contact Information</h2>
              <p className="text-xs text-slate-500">You have permission to update these fields</p>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Employee Editable
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="edit-phone-input">
                <Phone className="w-3.5 h-3.5 text-[#00ABE4]" />
                <span>Phone Number</span> <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-phone-input"
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                placeholder="+1 (555) 234-5678"
                className={`dayflow-input w-full ${phoneError ? 'border-red-500 focus:border-red-500' : ''}`}
                required
              />
              {phoneError && <p className="text-xs text-red-600 font-medium">{phoneError}</p>}
            </div>

            {/* Street Address */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="edit-street-input">
                <MapPin className="w-3.5 h-3.5 text-[#00ABE4]" />
                <span>Street Address</span>
              </label>
              <input
                id="edit-street-input"
                type="text"
                value={address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="742 Evergreen Terrace, Suite 400"
                className="dayflow-input w-full"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="edit-city-input">
                City
              </label>
              <input
                id="edit-city-input"
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="San Francisco"
                className="dayflow-input w-full"
              />
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="edit-state-input">
                State / Province
              </label>
              <input
                id="edit-state-input"
                type="text"
                value={address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                placeholder="CA"
                className="dayflow-input w-full"
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="edit-postal-input">
                Postal / Zip Code
              </label>
              <input
                id="edit-postal-input"
                type="text"
                value={address.postalCode}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                placeholder="94107"
                className="dayflow-input w-full"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="edit-country-input">
                Country
              </label>
              <input
                id="edit-country-input"
                type="text"
                value={address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                placeholder="United States"
                className="dayflow-input w-full"
              />
            </div>
          </div>
        </div>

        {/* 3. PROTECTED READ-ONLY FIELDS NOTIFICATION */}
        <div className="dayflow-card p-5 bg-slate-50 border-slate-200 space-y-3" id="locked-fields-notice">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Protected Company Records (Admin Managed)</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Employee ID (<span className="font-mono text-slate-700">{employee.employeeId}</span>), Official Name, Work Email, Designation, Department, Joining Date, and Salary Structure cannot be edited directly by employees. Please contact your HR administrator for updates.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to="/profile"
            className="btn-secondary text-sm px-4 py-2.5 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2 shadow-sm"
            id="save-profile-btn"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

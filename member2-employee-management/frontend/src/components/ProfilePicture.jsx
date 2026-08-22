import React, { useRef, useState } from 'react';
import { Camera, Trash2, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { validateProfilePicture } from '../utils/validation';

export default function ProfilePicture({
  avatarUrl,
  fullName = 'Employee',
  size = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  isEditable = false,
  onImageChange,
  onImageRemove,
  isUploading = false,
  error = null
}) {
  const fileInputRef = useRef(null);
  const [localError, setLocalError] = useState(null);

  // Derive size classes
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 md:w-28 md:h-28 text-2xl',
    xl: 'w-32 h-32 md:w-36 md:h-36 text-3xl'
  }[size] || 'w-24 h-24 text-2xl';

  const getInitials = (name) => {
    if (!name) return 'DF';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    const validationError = validateProfilePicture(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    if (onImageChange) {
      onImageChange(file);
    }
    // Clear input so selecting same file again triggers change
    e.target.value = '';
  };

  const handleRemove = () => {
    setLocalError(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const displayedError = error || localError;

  return (
    <div className="flex flex-col items-center gap-3" id="profile-picture-container">
      <div className="relative group">
        <div
          className={`${sizeClasses} rounded-full overflow-hidden border-2 border-white shadow-md bg-[#E9F1FA] text-[#00ABE4] font-semibold flex items-center justify-center relative shrink-0 transition-transform`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to initials if image link breaks
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span className="select-none tracking-tight">{getInitials(fullName)}</span>
          )}

          {/* Uploading indicator overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Quick hover button on large avatar if editable */}
        {isEditable && !isUploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00ABE4] hover:bg-[#0096ca] text-white flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-95"
            title="Upload new photo"
            aria-label="Upload new photo"
            id="avatar-quick-upload-btn"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        id="profile-picture-input"
      />

      {/* Editable controls below avatar */}
      {isEditable && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
              id="upload-photo-btn"
            >
              <Upload className="w-3.5 h-3.5 text-[#00ABE4]" />
              <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            {avatarUrl && (
              <button
                type="button"
                disabled={isUploading}
                onClick={handleRemove}
                className="text-xs px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors inline-flex items-center gap-1"
                id="remove-photo-btn"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            JPG, PNG or WEBP. Max 5MB.
          </p>
        </div>
      )}

      {/* Error state alert */}
      {displayedError && (
        <div
          className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 max-w-xs text-center animate-in fade-in"
          id="avatar-error-msg"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{displayedError}</span>
        </div>
      )}
    </div>
  );
}

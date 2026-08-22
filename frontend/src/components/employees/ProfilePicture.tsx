import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

interface ProfilePictureProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onUpload?: (file: File) => Promise<void>;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  name = "User",
  size = "lg",
  editable = false,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      try {
        setUploading(true);
        await onUpload(e.target.files[0]);
      } finally {
        setUploading(false);
      }
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-20 h-20 text-xl",
    xl: "w-28 h-28 text-3xl",
  }[size];

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative inline-block group">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses} rounded-2xl object-cover border-2 border-white shadow-md`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 text-white font-extrabold flex items-center justify-center border-2 border-white shadow-md`}
        >
          {initial}
        </div>
      )}

      {editable && onUpload && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg transition-all active:scale-90"
            title="Change photo"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePicture;

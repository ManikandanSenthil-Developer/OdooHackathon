import React, { useState, useEffect } from "react";
import { Phone, MapPin, Building, Briefcase, Save } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { employeeService } from "../../services/employeeService";
import { Employee } from "../../types/employee";
import { ProfilePicture } from "../../components/employees/ProfilePicture";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const MyProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const employeeId = currentUser?.employee_id || "EMP001";
      let emp: any = null;
      try {
        const res = await employeeService.getEmployeeById(employeeId);
        if (res.success) emp = res.data;
      } catch {
        const list = await employeeService.getEmployees({
          search: currentUser?.email,
        });
        if (list.success && list.data.length > 0) emp = list.data[0];
      }

      if (emp) {
        setEmployee(emp);
        setPhone(emp.phone || "");
        setAddress(emp.address || "");
      }
    } catch (err: any) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const handleAvatarUpload = async (file: File) => {
    const targetId =
      employee?.employee_id || currentUser?.employee_id || "EMP001";
    try {
      const res = await employeeService.uploadProfilePicture(targetId, file);
      if (res.success) {
        success("Profile picture updated successfully!");
        fetchProfile();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to upload picture");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId =
      employee?.employee_id || currentUser?.employee_id || "EMP001";
    try {
      setSaving(true);
      const res = await employeeService.updateOwnProfile(targetId, {
        phone,
        address,
      });
      if (res.success) {
        success("Contact details updated successfully!");
        setEmployee(res.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  const name = employee?.name || currentUser?.name || "Sarah Connor";
  const email = employee?.email || currentUser?.email || "employee@dayflow.com";
  const designation = employee?.designation || "Senior Software Engineer";
  const department = employee?.department || "Engineering & HR Tech";
  const employeeId =
    employee?.employee_id || currentUser?.employee_id || "EMP001";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <ProfilePicture
          src={employee?.profile_picture}
          name={name}
          size="xl"
          editable={true}
          onUpload={handleAvatarUpload}
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">{name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 self-center sm:self-auto">
              {currentUser?.role}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mt-1.5">
            <span className="font-medium text-slate-700 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {designation}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {department}
            </span>
            <span>•</span>
            <span className="font-mono text-brand-600 font-bold">
              {employeeId}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Personal & Contact Preferences
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            You can update your personal contact phone and residential address
            directly.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                disabled
                value={name}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Street, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm shadow-brand-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;

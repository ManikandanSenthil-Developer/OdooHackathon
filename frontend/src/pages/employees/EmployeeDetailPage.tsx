import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  FileText,
  CreditCard,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { employeeService } from "../../services/employeeService";
import { documentService } from "../../services/documentService";
import { Employee, DocumentItem } from "../../types/employee";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ProfilePicture } from "../../components/employees/ProfilePicture";
import { DocumentList } from "../../components/employees/DocumentList";
import { DocumentUploader } from "../../components/employees/DocumentUploader";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { success, error } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "profile" | "documents" | "compensation"
  >("profile");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const fetchEmployeeDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [empRes, docRes] = await Promise.all([
        employeeService.getEmployeeById(id),
        documentService.getDocuments(id),
      ]);

      if (empRes.success) setEmployee(empRes.data);
      if (docRes.success) setDocuments(docRes.data);
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const handleAvatarUpload = async (file: File) => {
    if (!id) return;
    try {
      const res = await employeeService.uploadProfilePicture(id, file);
      if (res.success) {
        success("Profile picture updated successfully!");
        fetchEmployeeDetails();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update avatar");
    }
  };

  const handleDocUpload = async (file: File, name: string) => {
    if (!id) return;
    const res = await documentService.uploadDocument(id, file, name);
    if (res.success) {
      success("Document uploaded to employee record!");
      fetchEmployeeDetails();
    }
  };

  const handleDocDelete = async (docId: string) => {
    try {
      const res = await documentService.deleteDocument(docId);
      if (res.success) {
        success("Document deleted.");
        fetchEmployeeDetails();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to delete document");
    }
  };

  if (loading && !employee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Employee not found</h2>
        <Link
          to="/admin/employees"
          className="text-xs font-bold text-brand-600 underline mt-2 block"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <Link
        to="/admin/employees"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workforce Directory
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <ProfilePicture
            src={employee.profile_picture}
            name={employee.name}
            size="xl"
            editable={true}
            onUpload={handleAvatarUpload}
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">
                {employee.name}
              </h1>
              <StatusBadge status="ACTIVE" size="sm" />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {employee.designation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {employee.department}
              </span>
              <span>•</span>
              <span className="font-mono text-brand-600 font-bold">
                {employee.employee_id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDocModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        {[
          { id: "profile", label: "Personal & Contact Info", icon: User },
          {
            id: "documents",
            label: `Documents Vault (${documents.length})`,
            icon: FileText,
          },
          {
            id: "compensation",
            label: "Compensation & Benefits",
            icon: CreditCard,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                isActive
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Contact Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Email
                  </span>
                  <span className="text-slate-800 font-medium">
                    {employee.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Phone
                  </span>
                  <span className="text-slate-800 font-medium">
                    {employee.phone || "Not Provided"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Residential Address
                  </span>
                  <span className="text-slate-800 font-medium">
                    {employee.address || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Employment Overview
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Joining Date
                  </span>
                  <span className="text-slate-800 font-medium">
                    {new Date(employee.joining_date).toLocaleDateString(
                      "en-US",
                      {
                        dateStyle: "long",
                      },
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Building className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Department
                  </span>
                  <span className="text-slate-800 font-medium">
                    {employee.department}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Designation
                  </span>
                  <span className="text-slate-800 font-medium">
                    {employee.designation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Employment Records & Attachments
            </h3>
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
          </div>
          <DocumentList
            documents={documents}
            canManage={true}
            onDelete={handleDocDelete}
          />
        </div>
      )}

      {activeTab === "compensation" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Salary Assignment
          </h3>
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase text-brand-100 font-bold">
                Annual Compensation
              </span>
              <div className="text-3xl font-extrabold mt-0.5">
                ${Number(employee.salary).toLocaleString()}
              </div>
            </div>
            <Link
              to="/admin/payroll"
              className="px-4 py-2 rounded-xl bg-white text-brand-600 font-bold text-xs shadow-sm hover:bg-brand-50 transition-colors"
            >
              Manage in Payroll Center →
            </Link>
          </div>
        </div>
      )}

      <DocumentUploader
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onUpload={handleDocUpload}
      />
    </div>
  );
};

export default EmployeeDetailPage;

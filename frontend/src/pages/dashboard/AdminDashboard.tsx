import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  ArrowRight,
  CheckCircle2,
  Building,
  UserPlus,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { dashboardService } from "../../services/dashboardService";
import { leaveService } from "../../services/leaveService";
import { employeeService } from "../../services/employeeService";
import { AdminDashboardData } from "../../types/dashboard";
import { Employee } from "../../types/employee";
import { EmployeeForm } from "../../components/employees/EmployeeForm";
import { LeaveDetailsModal } from "../../components/leave/LeaveDetailsModal";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const AdminDashboard: React.FC = () => {
  const { success } = useToast();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getAdminDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateEmployee = async (empData: Partial<Employee>) => {
    const res = await employeeService.createEmployee(empData);
    if (res.success) {
      success("New employee successfully registered into Dayflow!");
      fetchAdminData();
    }
  };

  const handleApproveLeave = async (id: string, comment?: string) => {
    const res = await leaveService.approveLeave(id, comment);
    if (res.success) {
      success("Leave request approved successfully!");
      fetchAdminData();
    }
  };

  const handleRejectLeave = async (id: string, comment?: string) => {
    const res = await leaveService.rejectLeave(id, comment);
    if (res.success) {
      success("Leave request rejected.");
      fetchAdminData();
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-16 bg-slate-200/60 rounded-2xl animate-pulse" />
        <LoadingSkeleton type="stats" />
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  const stats = data?.stats || {
    totalEmployees: 4,
    admins: 1,
    employees: 4,
    presentTodayCount: 4,
    pendingLeaveApprovals: 2,
    monthlyPayrollTotal: "$148,500.00",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Admin Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                Workforce Administration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Global oversight across personnel, attendance logs, leave review
              workflows, and payroll
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmployeeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
          <Link
            to="/admin/employees"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
          >
            <Users className="w-4 h-4 text-slate-400" />
            Workforce Directory
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Workforce
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.totalEmployees}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">Active</span> in
            organization
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Present Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {stats.presentTodayCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {data?.attendanceSummary?.onTimeRate || "96.2%"} on-time rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Leaves
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {stats.pendingLeaveApprovals}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Requires HR administrator review
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Payroll Allocation
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.monthlyPayrollTotal}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Disbursement: {data?.payrollOverview?.currentCycle || "August 2026"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Pending Leave Approvals
              </h3>
            </div>
            <Link
              to="/admin/leave"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All Requests <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.leaveApprovals && data.leaveApprovals.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.leaveApprovals.map((req) => (
                <div
                  key={req.id}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900">
                      {req.employeeName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {req.type} • {req.dates} ({req.totalDays} days)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedLeave(req)}
                      className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              No pending leave approvals in queue!
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building className="w-5 h-5 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Department Attendance
              </h3>
            </div>
            <Link
              to="/admin/attendance"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Full Roster <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.attendanceSummary?.departmentBreakdown?.map((dept, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                  <span>{dept.department}</span>
                  <span className="text-brand-600">
                    {dept.present} / {dept.total} Present
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.round((dept.present / (dept.total || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EmployeeForm
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />

      <LeaveDetailsModal
        isOpen={Boolean(selectedLeave)}
        leave={selectedLeave}
        isAdmin={true}
        onClose={() => setSelectedLeave(null)}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
      />
    </div>
  );
};

export default AdminDashboard;

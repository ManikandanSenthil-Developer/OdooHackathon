import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  User,
  Plus,
  ArrowRight,
  Building,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { dashboardService } from "../../services/dashboardService";
import { attendanceService } from "../../services/attendanceService";
import { leaveService } from "../../services/leaveService";
import { EmployeeDashboardData } from "../../types/dashboard";
import { LeaveBalanceSummary, LeaveType } from "../../types/leave";
import { StatusBadge } from "../../components/common/StatusBadge";
import { AttendanceCard } from "../../components/attendance/AttendanceCard";
import { LeaveFormModal } from "../../components/leave/LeaveFormModal";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [balances, setBalances] = useState<LeaveBalanceSummary | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, balRes, attRes] = await Promise.all([
        dashboardService.getEmployeeDashboard(),
        leaveService.getMyBalance(),
        attendanceService.getToday(),
      ]);

      if (dashRes.success) setData(dashRes.data);
      if (balRes.success) setBalances(balRes.data);
      if (attRes.success) setTodayAttendance(attRes.data);
    } catch (err: any) {
      console.error("Failed to load employee dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await attendanceService.checkIn();
      if (res.success) {
        setTodayAttendance(res.data);
        success("Checked in successfully for today!");
        fetchDashboard();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await attendanceService.checkOut();
      if (res.success) {
        setTodayAttendance(res.data);
        success("Checked out successfully!");
        fetchDashboard();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Check-out failed");
    }
  };

  const handleApplyLeave = async (leaveData: {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    remarks?: string;
  }) => {
    const res = await leaveService.applyLeave(leaveData);
    if (res.success) {
      success("Leave application submitted successfully for review!");
      fetchDashboard();
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-20 bg-slate-200/60 rounded-2xl animate-pulse" />
        <LoadingSkeleton type="stats" />
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  const profile = data?.profile || {
    name: currentUser?.name || "Sarah Connor",
    email: currentUser?.email || "employee@dayflow.com",
    jobTitle: "Senior Software Engineer",
    department: "Engineering & HR Tech",
    employeeId: currentUser?.employee_id || "EMP001",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/25 flex-shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Welcome back, {profile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 hidden sm:inline-block">
                Employee Portal
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {profile.jobTitle}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {profile.department}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-400 font-bold">
                {profile.employeeId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </button>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
          >
            <User className="w-4 h-4 text-slate-400" />
            My Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendanceCard
            attendance={todayAttendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Paid Annual Leave
              </span>
              <div className="text-2xl font-black text-slate-900">
                {balances?.paid_leave?.available ?? 14}{" "}
                <span className="text-xs font-medium text-slate-400">
                  Days Left
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total Annual Quota: 18
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Sick / Medical Leave
              </span>
              <div className="text-2xl font-black text-rose-600">
                {balances?.sick_leave?.available ?? 10}{" "}
                <span className="text-xs font-medium text-slate-400">
                  Days Left
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total Medical Quota: 12
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Monthly Net Salary
              </span>
              <div className="text-2xl font-black text-brand-600">
                {data?.salary?.netPay || "$7,630.00"}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {data?.salary?.payCycle || "Monthly Cycle"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Leave Applications
                </h3>
              </div>
              <Link
                to="/leave"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {data?.leaveRequests?.recentRequests &&
            data.leaveRequests.recentRequests.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.leaveRequests.recentRequests.map((req: any) => (
                  <div
                    key={req.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{req.type}</div>
                      <div className="text-[11px] text-slate-400">
                        {req.dates} • {req.reason}
                      </div>
                    </div>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No recent leave requests found.
              </div>
            )}
          </div>
        </div>
      </div>

      <LeaveFormModal
        isOpen={isLeaveModalOpen}
        balances={balances}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleApplyLeave}
      />
    </div>
  );
};

export default EmployeeDashboard;

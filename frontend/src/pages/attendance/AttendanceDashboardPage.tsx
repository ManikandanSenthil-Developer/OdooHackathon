import React, { useState, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { attendanceService } from "../../services/attendanceService";
import { AttendanceRecord } from "../../types/attendance";
import { AttendanceCard } from "../../components/attendance/AttendanceCard";
import { AttendanceTable } from "../../components/attendance/AttendanceTable";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const AttendanceDashboardPage: React.FC = () => {
  const { success, error } = useToast();

  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [weekAttendance, setWeekAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const [todayRes, weekRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getWeek(),
      ]);

      if (todayRes.success) setTodayAttendance(todayRes.data);
      if (weekRes.success) setWeekAttendance(weekRes.data);
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await attendanceService.checkIn();
      if (res.success) {
        setTodayAttendance(res.data);
        success("Checked in successfully!");
        fetchAttendance();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Check in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await attendanceService.checkOut();
      if (res.success) {
        setTodayAttendance(res.data);
        success("Checked out successfully!");
        fetchAttendance();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Check out failed");
    }
  };

  if (loading && !todayAttendance && weekAttendance.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Attendance Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Log your daily office hours and review your recent 7-day attendance
            history
          </p>
        </div>

        <button
          onClick={fetchAttendance}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors self-start sm:self-auto"
          title="Refresh Attendance"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendanceCard
            attendance={todayAttendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Recent 7-Day Attendance Logs
            </h3>
          </div>
          <AttendanceTable records={weekAttendance} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboardPage;

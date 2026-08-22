import React, { useState, useEffect } from "react";
import { Calendar, RefreshCw, Users } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { attendanceService } from "../../services/attendanceService";
import { AttendanceRecord } from "../../types/attendance";
import { AttendanceTable } from "../../components/attendance/AttendanceTable";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const AdminAttendancePage: React.FC = () => {
  const { error } = useToast();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWorkforceAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAll({
        date: dateFilter || undefined,
        employeeId: employeeIdFilter || undefined,
      });

      if (res.success) {
        setRecords(res.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to load attendance roster");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkforceAttendance();
  }, [dateFilter]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkforceAttendance();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900">
            Workforce Attendance Overview
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            Admin Oversight
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Monitor real-time clock-in/out timestamps, hours worked, and employee
          attendance status across all departments
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
        >
          <div className="relative w-full sm:w-64">
            <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by Employee ID..."
              value={employeeIdFilter}
              onChange={(e) => setEmployeeIdFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all shadow-xs"
          >
            Apply Filters
          </button>
        </form>

        <button
          onClick={() => {
            setDateFilter("");
            setEmployeeIdFilter("");
            fetchWorkforceAttendance();
          }}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
          title="Reset Filters"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        <AttendanceTable records={records} showEmployee={true} />
      )}
    </div>
  );
};

export default AdminAttendancePage;

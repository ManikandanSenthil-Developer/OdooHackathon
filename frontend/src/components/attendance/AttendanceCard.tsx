import React from 'react';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { AttendanceRecord } from '../../types/attendance';
import { StatusBadge } from '../common/StatusBadge';

interface AttendanceCardProps {
  attendance: AttendanceRecord | null;
  loading?: boolean;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  loading = false,
  onCheckIn,
  onCheckOut,
}) => {
  const isCheckedIn = Boolean(attendance?.checkIn);
  const isCheckedOut = Boolean(attendance?.checkOut);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Attendance</h3>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <StatusBadge status={isCheckedOut ? 'Checked Out' : isCheckedIn ? 'Checked In' : 'Not Checked In'} size="md" />
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 text-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Check-In</span>
          <span className="text-sm font-bold text-slate-800">{formatTime(attendance?.checkIn || null)}</span>
        </div>
        <div className="border-x border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Check-Out</span>
          <span className="text-sm font-bold text-slate-800">{formatTime(attendance?.checkOut || null)}</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hours</span>
          <span className="text-sm font-bold text-brand-600">{attendance?.workingHours ? `${attendance.workingHours.toFixed(1)} hrs` : '--'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isCheckedIn ? (
          <button
            onClick={onCheckIn}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Logging in...' : 'Clock In Now'}
          </button>
        ) : !isCheckedOut ? (
          <button
            onClick={onCheckOut}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {loading ? 'Logging out...' : 'Clock Out Now'}
          </button>
        ) : (
          <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Attendance complete for today!
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCard;

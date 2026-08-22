import React from 'react';
import { CalendarDays, Clock3, LogIn, LogOut } from 'lucide-react';
import { AttendanceRecord } from '../../services/attendance.api';

interface AttendanceCardProps {
  attendance: AttendanceRecord | null;
}

const formatTime = (value: string | null): string =>
  value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';

const statusStyles: Record<string, string> = {
  PRESENT: 'bg-emerald-50 text-emerald-700',
  ABSENT: 'bg-rose-50 text-rose-700',
  HALFDAY: 'bg-amber-50 text-amber-700',
  LEAVE: 'bg-violet-50 text-violet-700',
};

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ attendance }) => (
  <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50">
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Today&apos;s attendance</p>
        <h2 className="mt-2 text-xl font-bold text-[#1F2937]">{attendance ? 'Workday in progress' : 'No check-in yet'}</h2>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[attendance?.status || 'ABSENT']}`}>
        {attendance?.status || 'ABSENT'}
      </span>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Metric icon={<LogIn size={17} />} label="Check in" value={formatTime(attendance?.checkIn || null)} />
      <Metric icon={<LogOut size={17} />} label="Check out" value={formatTime(attendance?.checkOut || null)} />
      <Metric icon={<Clock3 size={17} />} label="Hours" value={`${attendance?.workingHours?.toFixed(2) || '0.00'}h`} />
    </div>

    <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
      <CalendarDays size={16} className="text-[#00ABE4]" />
      {attendance ? new Date(attendance.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Record your first check-in'}
    </p>
  </section>
);

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-[#E9F1FA]/50 p-4">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#00ABE4]">{icon}{label}</div>
    <p className="mt-2 text-lg font-bold text-[#1F2937]">{value}</p>
  </div>
);
import React from 'react';
import { AttendanceRecord } from '../../services/attendance.api';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployee?: boolean;
}

const formatTime = (value: string | null): string =>
  value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';

const statusStyles: Record<string, string> = {
  PRESENT: 'bg-emerald-50 text-emerald-700',
  ABSENT: 'bg-rose-50 text-rose-700',
  HALFDAY: 'bg-amber-50 text-amber-700',
  LEAVE: 'bg-violet-50 text-violet-700',
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, showEmployee = false }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-lg shadow-slate-200/40">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-[#E9F1FA] text-xs uppercase tracking-wide text-[#1F2937]">
        <tr>
          {showEmployee && <th className="whitespace-nowrap px-5 py-4 font-bold">Employee</th>}
          <th className="whitespace-nowrap px-5 py-4 font-bold">Date</th>
          <th className="whitespace-nowrap px-5 py-4 font-bold">Check in</th>
          <th className="whitespace-nowrap px-5 py-4 font-bold">Check out</th>
          <th className="whitespace-nowrap px-5 py-4 font-bold">Hours</th>
          <th className="whitespace-nowrap px-5 py-4 font-bold">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {records.length === 0 ? (
          <tr><td colSpan={showEmployee ? 6 : 5} className="px-5 py-10 text-center text-slate-500">No attendance records found.</td></tr>
        ) : records.map((record) => (
          <tr key={record.id} className="hover:bg-slate-50">
            {showEmployee && <td className="px-5 py-4"><span className="font-semibold text-[#1F2937]">{record.employee?.name || record.employeeId}</span>{record.employee?.email && <span className="block text-xs text-slate-500">{record.employee.email}</span>}</td>}
            <td className="whitespace-nowrap px-5 py-4 text-slate-700">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td className="px-5 py-4 text-slate-700">{formatTime(record.checkIn)}</td>
            <td className="px-5 py-4 text-slate-700">{formatTime(record.checkOut)}</td>
            <td className="px-5 py-4 font-semibold text-slate-700">{record.workingHours.toFixed(2)}h</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[record.status] || 'bg-slate-100 text-slate-700'}`}>{record.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
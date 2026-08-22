import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { AttendanceRecord } from '../../types/attendance';
import { StatusBadge } from '../common/StatusBadge';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployee?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  showEmployee = false,
}) => {
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!records || records.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-700">No attendance logs found</h4>
        <p className="text-xs text-slate-400 mt-1">There are no records for the selected date range.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {showEmployee && <th className="py-3.5 px-6">Employee</th>}
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Check-In</th>
              <th className="py-3.5 px-6">Check-Out</th>
              <th className="py-3.5 px-6">Hours Worked</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                {showEmployee && (
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 font-bold text-xs flex items-center justify-center">
                        {rec.employee?.name ? rec.employee.name.charAt(0) : 'E'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{rec.employee?.name || rec.employeeId}</div>
                        <div className="text-[11px] text-slate-400">{rec.employee?.department || rec.employeeId}</div>
                      </div>
                    </div>
                  </td>
                )}

                <td className="py-4 px-6">
                  <span className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(rec.date)}
                  </span>
                </td>

                <td className="py-4 px-6 text-xs text-slate-600 font-medium">{formatTime(rec.checkIn)}</td>
                <td className="py-4 px-6 text-xs text-slate-600 font-medium">{formatTime(rec.checkOut)}</td>
                <td className="py-4 px-6 text-xs font-bold text-slate-700">{rec.workingHours ? `${rec.workingHours.toFixed(1)} hrs` : '--'}</td>
                <td className="py-4 px-6 text-right"><StatusBadge status={rec.status} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;

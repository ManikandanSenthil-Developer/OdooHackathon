import React from 'react';
import { Eye, Calendar, Clock, MessageSquare } from 'lucide-react';
import { LeaveRequest } from '../../types/leave';
import { StatusBadge } from '../common/StatusBadge';

interface LeaveHistoryTableProps {
  leaves: LeaveRequest[];
  onViewDetails: (leave: LeaveRequest) => void;
}

export const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ leaves, onViewDetails }) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-5">Leave Type</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4 text-center">Days</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Remarks</th>
              <th className="py-3.5 px-4">HR Comments</th>
              <th className="py-3.5 px-4">Submitted Date</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaves.map((item) => (
              <tr key={item.id} className="hover:bg-brand-50/30 transition-colors">
                <td className="py-4 px-5">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    {item.leave_type === 'PAID' ? 'Paid Leave' : item.leave_type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave'}
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                  {formatDate(item.start_date)} – {formatDate(item.end_date)}
                </td>
                <td className="py-4 px-4 text-center font-bold text-slate-900">
                  {item.total_days}
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-4 px-4 text-slate-500 max-w-xs truncate" title={item.remarks}>
                  {item.remarks || <span className="text-slate-300 italic">None</span>}
                </td>
                <td className="py-4 px-4 text-slate-500 max-w-xs truncate" title={item.admin_comment}>
                  {item.admin_comment || <span className="text-slate-300 italic">Pending review</span>}
                </td>
                <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(item.created_at)}
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onViewDetails(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-slate-100">
        {leaves.map((item) => (
          <div key={item.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">
                {item.leave_type === 'PAID' ? 'Paid Leave' : item.leave_type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave'}
              </span>
              <StatusBadge status={item.status} />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              <span>{formatDate(item.start_date)} – {formatDate(item.end_date)} ({item.total_days} days)</span>
            </div>

            {item.remarks && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{item.remarks}"
              </p>
            )}

            {item.admin_comment && (
              <div className="flex items-start gap-1.5 text-xs text-brand-700 bg-brand-50/60 p-2.5 rounded-xl border border-brand-100">
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>HR: {item.admin_comment}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Submitted {formatDate(item.created_at)}</span>
              <button
                onClick={() => onViewDetails(item)}
                className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

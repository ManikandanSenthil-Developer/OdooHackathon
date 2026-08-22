import React from "react";
import { Calendar, Eye } from "lucide-react";
import { LeaveRequest } from "../../types/leave";
import { StatusBadge } from "../common/StatusBadge";

interface LeaveHistoryTableProps {
  leaves: LeaveRequest[];
  isAdmin?: boolean;
  onReview?: (leave: LeaveRequest) => void;
}

export const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({
  leaves,
  isAdmin = false,
  onReview,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!leaves || leaves.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-700">
          No leave requests found
        </h4>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isAdmin && <th className="py-3.5 px-6">Employee</th>}
              <th className="py-3.5 px-6">Leave Type</th>
              <th className="py-3.5 px-6">Duration & Dates</th>
              <th className="py-3.5 px-6">Days</th>
              <th className="py-3.5 px-6">Reason</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {isAdmin && (
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800 text-xs">
                      {leave.employee_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {leave.employee_id}
                    </div>
                  </td>
                )}
                <td className="py-4 px-6 text-xs font-bold text-slate-700">
                  {leave.leave_type} Leave
                </td>
                <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                  {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                </td>
                <td className="py-4 px-6 text-xs font-bold text-slate-700">
                  {leave.total_days} days
                </td>
                <td className="py-4 px-6 text-xs text-slate-500 truncate max-w-xs">
                  {leave.remarks || "--"}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={leave.status} size="sm" />
                </td>
                <td className="py-4 px-6 text-right">
                  {onReview && (
                    <button
                      onClick={() => onReview(leave)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isAdmin && leave.status === "PENDING"
                        ? "Review"
                        : "View"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistoryTable;

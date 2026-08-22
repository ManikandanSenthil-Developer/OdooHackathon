import React, { useState } from "react";
import {
  X,
  Check,
  AlertOctagon,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { LeaveRequest } from "../../types/leave";
import { StatusBadge } from "../common/StatusBadge";

interface LeaveDetailsModalProps {
  isOpen: boolean;
  leave: LeaveRequest | null;
  isAdmin?: boolean;
  onClose: () => void;
  onApprove?: (id: string, comment?: string) => Promise<void>;
  onReject?: (id: string, comment?: string) => Promise<void>;
}

export const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  leave,
  isAdmin = false,
  onClose,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  if (!isOpen || !leave) return null;

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setActionLoading(true);
      await onApprove(leave.id, comment);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    try {
      setActionLoading(true);
      await onReject(leave.id, comment);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Leave Application Details
            </h3>
            <p className="text-xs text-slate-400">Ref: {leave.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">
                  {leave.employee_name}
                </div>
                <div className="text-xs text-slate-400">
                  {leave.employee_id}
                </div>
              </div>
            </div>
            <StatusBadge status={leave.status} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block mb-1">
                Leave Category
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {leave.leave_type} Leave
              </span>
            </div>
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block mb-1">
                Total Duration
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {leave.total_days} Day(s)
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 text-xs text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="font-bold">Period: </span>
              {new Date(leave.start_date).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}{" "}
              to{" "}
              {new Date(leave.end_date).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </div>
          </div>

          {leave.remarks && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employee Reason:
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                {leave.remarks}
              </div>
            </div>
          )}

          {isAdmin && leave.status === "PENDING" && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                HR Remarks (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Approved per vacation policy..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleReject}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                >
                  <AlertOctagon className="w-4 h-4" /> Reject Request
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Approve Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;

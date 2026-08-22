import React, { useState } from 'react';
import { X, Calendar, User, Clock, MessageSquare, Check, Ban, AlertCircle } from 'lucide-react';
import { LeaveRequest } from '../../types/leave';
import { StatusBadge } from '../common/StatusBadge';

interface LeaveDetailsModalProps {
  leave: LeaveRequest | null;
  isOpen: boolean;
  isAdmin?: boolean;
  onClose: () => void;
  onApprove?: (id: string, comment?: string) => Promise<void>;
  onReject?: (id: string, comment?: string) => Promise<void>;
  processing?: boolean;
}

export const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  leave,
  isOpen,
  isAdmin = false,
  onClose,
  onApprove,
  onReject,
  processing,
}) => {
  const [comment, setComment] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isOpen || !leave) return null;

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

  const handleApprove = async () => {
    setActionError(null);
    if (!onApprove) return;
    try {
      await onApprove(leave.id, comment.trim());
      onClose();
    } catch (err: any) {
      setActionError(err.response?.data?.message || err.message || 'Failed to approve request');
    }
  };

  const handleReject = async () => {
    setActionError(null);
    if (!onReject) return;
    try {
      await onReject(leave.id, comment.trim());
      onClose();
    } catch (err: any) {
      setActionError(err.response?.data?.message || err.message || 'Failed to reject request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gradient-soft-card">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Leave Request Details</h3>
            <p className="text-xs text-slate-500">ID: {leave.id.substring(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {actionError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm">
                {leave.employee_name ? leave.employee_name.charAt(0) : 'E'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{leave.employee_name}</h4>
                <p className="text-xs text-slate-500">{leave.employee_id} {leave.employee_email ? '• ' + leave.employee_email : ''}</p>
              </div>
            </div>
            <StatusBadge status={leave.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Leave Type</span>
              <span className="font-bold text-slate-800 text-sm">
                {leave.leave_type === 'PAID' ? 'Paid Leave' : leave.leave_type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Total Days</span>
              <span className="font-bold text-brand-600 text-sm">{leave.total_days} Calendar Day(s)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <span className="text-slate-400 block">Date Range:</span>
            <div className="font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>{formatDate(leave.start_date)} – {formatDate(leave.end_date)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Employee Remarks
            </span>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              {leave.remarks || <span className="text-slate-400 italic">No remarks provided.</span>}
            </div>
          </div>

          {leave.admin_comment && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                HR Officer Note ({leave.approved_by || 'HR Admin'})
              </span>
              <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-100 text-xs text-brand-900 leading-relaxed">
                {leave.admin_comment}
              </div>
            </div>
          )}

          {isAdmin && leave.status === 'PENDING' && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Admin Review Comment / Reason
              </label>
              <textarea
                rows={2}
                placeholder="Optional approval note or reason for rejection..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
              />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all disabled:opacity-50 active:scale-95"
                >
                  <Ban className="w-4 h-4" />
                  Reject Request
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Approve Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

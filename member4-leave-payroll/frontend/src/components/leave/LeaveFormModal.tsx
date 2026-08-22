import React, { useState } from 'react';
import { X, Calendar, FileText, AlertCircle, Clock } from 'lucide-react';
import { CreateLeavePayload, LeaveType } from '../../types/leave';

interface LeaveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeavePayload) => Promise<void>;
  submitting: boolean;
}

export const LeaveFormModal: React.FC<LeaveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [leaveType, setLeaveType] = useState<LeaveType>('PAID');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const getEstimatedDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    if (diff < 0) return 0;
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const estimatedDays = getEstimatedDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setFormError('Start date cannot be after end date.');
      return;
    }

    try {
      await onSubmit({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        remarks: remarks.trim(),
      });
      setRemarks('');
      onClose();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to submit leave request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gradient-soft-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Apply for Leave</h3>
              <p className="text-xs text-slate-500">Submit a leave request for HR review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Leave Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'PAID', label: 'Paid Leave' },
                { type: 'SICK', label: 'Sick Leave' },
                { type: 'UNPAID', label: 'Unpaid Leave' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setLeaveType(item.type as LeaveType)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    leaveType === item.type
                      ? 'border-brand-500 bg-brand-50/80 text-brand-700 shadow-xs ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-50/60 border border-brand-100 text-brand-800 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Requested Duration:</span>
            </div>
            <span className="font-bold text-sm text-brand-700">
              {estimatedDays > 0 ? `${estimatedDays} Day(s)` : 'Invalid Date Range'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Reason / Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Add relevant context or notes for HR..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || estimatedDays <= 0}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 active:scale-95"
            >
              {submitting ? 'Submitting Request...' : 'Submit Leave Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

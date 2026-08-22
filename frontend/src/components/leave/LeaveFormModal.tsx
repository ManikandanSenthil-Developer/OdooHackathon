import React, { useState } from "react";
import { X, Calendar, Send, AlertCircle, Info } from "lucide-react";
import { LeaveType, LeaveBalanceSummary } from "../../types/leave";

interface LeaveFormModalProps {
  isOpen: boolean;
  balances: LeaveBalanceSummary | null;
  onClose: () => void;
  onSubmit: (data: {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    remarks?: string;
  }) => Promise<void>;
}

export const LeaveFormModal: React.FC<LeaveFormModalProps> = ({
  isOpen,
  balances,
  onClose,
  onSubmit,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>("PAID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  let calculatedDays = 0;
  if (startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (s <= e) {
      calculatedDays =
        Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const availablePaid = balances?.paid_leave?.available ?? 14;
  const availableSick = balances?.sick_leave?.available ?? 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }
    if (leaveType === "PAID" && calculatedDays > availablePaid) {
      setError(
        `Requested days (${calculatedDays}) exceed your available paid leave quota (${availablePaid}).`,
      );
      return;
    }
    if (leaveType === "SICK" && calculatedDays > availableSick) {
      setError(
        `Requested days (${calculatedDays}) exceed your available sick leave quota (${availableSick}).`,
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        remarks,
      });
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit leave application.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Apply for Time Off
              </h3>
              <p className="text-xs text-slate-400">
                Submit a leave request for management review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Leave Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "PAID", label: "Paid Leave", avail: availablePaid },
                { type: "SICK", label: "Sick Leave", avail: availableSick },
                { type: "UNPAID", label: "Unpaid Leave", avail: "Unlimited" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setLeaveType(opt.type as LeaveType)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    leaveType === opt.type
                      ? "border-brand-500 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {opt.type === "UNPAID"
                      ? opt.avail
                      : `${opt.avail} days left`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {calculatedDays > 0 && (
            <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-100 flex items-center justify-between text-xs text-brand-900 font-medium">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-500" />
                Requested Duration:
              </span>
              <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-brand-200 shadow-xs">
                {calculatedDays} Calendar Day{calculatedDays > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason / Remarks
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-sm shadow-brand-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveFormModal;

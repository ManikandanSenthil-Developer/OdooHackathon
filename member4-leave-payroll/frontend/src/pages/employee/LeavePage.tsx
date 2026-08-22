import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { leaveService } from '../../services/leaveService';
import { LeaveBalanceSummary, LeaveRequest } from '../../types/leave';
import { LeaveBalanceCard } from '../../components/leave/LeaveBalanceCard';
import { LeaveHistoryTable } from '../../components/leave/LeaveHistoryTable';
import { LeaveFormModal } from '../../components/leave/LeaveFormModal';
import { LeaveDetailsModal } from '../../components/leave/LeaveDetailsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton, LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ToastContainer } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export const LeavePage: React.FC = () => {
  const [balance, setBalance] = useState<LeaveBalanceSummary | undefined>();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [balRes, leavesRes] = await Promise.all([
        leaveService.getBalance(),
        leaveService.getMyLeaves(),
      ]);
      setBalance(balRes);
      setLeaves(leavesRes);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to load leave requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplySubmit = async (payload: any) => {
    setSubmitting(true);
    try {
      const created = await leaveService.applyLeave(payload);
      addToast('success', 'Leave Request Submitted', 'Your request has been placed in PENDING status for HR review.');
      await fetchData();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your leave requests and balances.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-brand-500/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1 text-xs font-semibold text-rose-700 bg-white rounded-lg border border-rose-200 hover:bg-rose-50"
          >
            Retry
          </button>
        </div>
      )}

      <section>
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Leave Balances</h2>
        </div>
        {loading ? <CardSkeleton /> : <LeaveBalanceCard balance={balance} />}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Leave Application History</h2>
          <span className="text-xs text-slate-400 font-medium">{leaves.length} Request(s) Total</span>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : leaves.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No leave requests found"
            description="You have not submitted any leave requests yet. Click 'Apply for Leave' to get started."
            actionText="Apply for Leave"
            onAction={() => setIsApplyModalOpen(true)}
          />
        ) : (
          <LeaveHistoryTable leaves={leaves} onViewDetails={(item) => setSelectedLeave(item)} />
        )}
      </section>

      <LeaveFormModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        submitting={submitting}
      />

      <LeaveDetailsModal
        leave={selectedLeave}
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
      />
    </div>
  );
};

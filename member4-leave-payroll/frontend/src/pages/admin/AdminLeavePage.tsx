import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { leaveService } from '../../services/leaveService';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../types/leave';
import { LeaveHistoryTable } from '../../components/leave/LeaveHistoryTable';
import { LeaveDetailsModal } from '../../components/leave/LeaveDetailsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ToastContainer } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export const AdminLeavePage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [processing, setProcessing] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaveService.getAdminLeaves({
        search: search || undefined,
        status: statusFilter || undefined,
        leave_type: typeFilter || undefined,
      });
      setLeaves(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load employee leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeaves();
  };

  const handleApprove = async (id: string, comment?: string) => {
    setProcessing(true);
    try {
      await leaveService.approveLeave(id, { admin_comment: comment });
      addToast('success', 'Leave Approved', 'The leave request was approved and balance has been deducted.');
      await fetchLeaves();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id: string, comment?: string) => {
    setProcessing(true);
    try {
      await leaveService.rejectLeave(id, { admin_comment: comment });
      addToast('info', 'Leave Request Declined', 'The request has been updated to REJECTED.');
      await fetchLeaves();
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaves.filter((l) => l.status === 'APPROVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workforce Leave Administration
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review, approve, or reject employee leave requests.</p>
        </div>

        <button
          onClick={fetchLeaves}
          disabled={loading}
          className="self-start md:self-auto p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-amber-700">Pending Review</span>
              <div className="text-2xl font-extrabold">{pendingCount}</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-emerald-700">Approved Leaves</span>
              <div className="text-2xl font-extrabold">{approvedCount}</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Total Applications</span>
              <div className="text-2xl font-extrabold">{leaves.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name, ID or remarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-700 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-700 font-semibold"
          >
            <option value="">All Leave Types</option>
            <option value="PAID">Paid Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="UNPAID">Unpaid Leave</option>
          </select>
        </div>
      </div>

      <section>
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : leaves.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No matching leave requests"
            description="There are currently no employee leave requests matching your filter criteria."
          />
        ) : (
          <LeaveHistoryTable leaves={leaves} onViewDetails={(item) => setSelectedLeave(item)} />
        )}
      </section>

      <LeaveDetailsModal
        leave={selectedLeave}
        isOpen={!!selectedLeave}
        isAdmin={true}
        onClose={() => setSelectedLeave(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        processing={processing}
      />
    </div>
  );
};

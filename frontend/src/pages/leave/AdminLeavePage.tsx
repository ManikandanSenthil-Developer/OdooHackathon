import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { leaveService } from "../../services/leaveService";
import { LeaveRequest } from "../../types/leave";
import { LeaveHistoryTable } from "../../components/leave/LeaveHistoryTable";
import { LeaveDetailsModal } from "../../components/leave/LeaveDetailsModal";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const AdminLeavePage: React.FC = () => {
  const { success, error } = useToast();

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const fetchAdminLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveService.getAdminLeaves({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        leave_type: typeFilter === "ALL" ? undefined : typeFilter,
        search: search || undefined,
      });

      if (res.success) {
        setLeaves(res.data);
      }
    } catch (err: any) {
      error(
        err.response?.data?.message ||
          "Failed to fetch workforce leave requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminLeaves();
  }, [statusFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminLeaves();
  };

  const handleApprove = async (id: string, comment?: string) => {
    const res = await leaveService.approveLeave(id, comment);
    if (res.success) {
      success("Leave request approved and employee quota balance updated!");
      fetchAdminLeaves();
    }
  };

  const handleReject = async (id: string, comment?: string) => {
    const res = await leaveService.rejectLeave(id, comment);
    if (res.success) {
      success("Leave request rejected.");
      fetchAdminLeaves();
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Workforce Leave Command Center
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review time-off submissions, approve vacation requests, and maintain
            balance governance
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, ID or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="PAID">Paid Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="UNPAID">Unpaid Leave</option>
          </select>

          <button
            onClick={fetchAdminLeaves}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        <LeaveHistoryTable
          leaves={leaves}
          isAdmin={true}
          onReview={(l) => setSelectedLeave(l)}
        />
      )}

      <LeaveDetailsModal
        isOpen={Boolean(selectedLeave)}
        leave={selectedLeave}
        isAdmin={true}
        onClose={() => setSelectedLeave(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminLeavePage;

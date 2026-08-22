import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { leaveService } from "../../services/leaveService";
import {
  LeaveRequest,
  LeaveBalanceSummary,
  LeaveType,
} from "../../types/leave";
import { LeaveBalanceCard } from "../../components/leave/LeaveBalanceCard";
import { LeaveHistoryTable } from "../../components/leave/LeaveHistoryTable";
import { LeaveFormModal } from "../../components/leave/LeaveFormModal";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const EmployeeLeavePage: React.FC = () => {
  const { success, error } = useToast();

  const [balances, setBalances] = useState<LeaveBalanceSummary | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [balRes, leaveRes] = await Promise.all([
        leaveService.getMyBalance(),
        leaveService.getMyLeaves(),
      ]);

      if (balRes.success) setBalances(balRes.data);
      if (leaveRes.success) setLeaves(leaveRes.data);
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to load leave records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleApplyLeave = async (data: {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    remarks?: string;
  }) => {
    const res = await leaveService.applyLeave(data);
    if (res.success) {
      success("Leave application submitted successfully!");
      fetchLeaveData();
    }
  };

  if (loading && !balances && leaves.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        <LoadingSkeleton type="card" count={3} />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Time-Off & Leave Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Check your available leave quota balances and submit new time-off
            requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </button>
          <button
            onClick={fetchLeaveData}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <LeaveBalanceCard balances={balances} />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900">
            My Leave Applications History
          </h3>
        </div>
        <LeaveHistoryTable leaves={leaves} />
      </div>

      <LeaveFormModal
        isOpen={isModalOpen}
        balances={balances}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplyLeave}
      />
    </div>
  );
};

export default EmployeeLeavePage;

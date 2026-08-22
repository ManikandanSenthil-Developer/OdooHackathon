import React from "react";
import { Calendar, HeartPulse, HelpCircle } from "lucide-react";
import { LeaveBalanceSummary } from "../../types/leave";

interface LeaveBalanceCardProps {
  balances: LeaveBalanceSummary | null;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  balances,
}) => {
  const paid = balances?.paid_leave || { total: 18, used: 4, available: 14 };
  const sick = balances?.sick_leave || { total: 12, used: 2, available: 10 };
  const unpaidUsed = balances?.unpaid_leave?.used || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Paid Annual Leave
          </span>
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {paid.available}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Days Available
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (paid.used / (paid.total || 18)) * 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Used: {paid.used} days</span>
          <span>Total Quota: {paid.total}</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Medical / Sick Leave
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {sick.available}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Days Available
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="bg-rose-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (sick.used / (sick.total || 12)) * 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Used: {sick.used} days</span>
          <span>Total Quota: {sick.total}</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Unpaid Leave (LWP)
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {unpaidUsed}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Days Used This Year
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
          Unpaid leaves require executive approval and do not decrement standard
          quota balances.
        </p>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;

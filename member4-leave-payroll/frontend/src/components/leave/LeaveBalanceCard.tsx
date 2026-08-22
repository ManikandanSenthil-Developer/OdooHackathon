import React from 'react';
import { CalendarCheck, HeartPulse, Clock, Sparkles } from 'lucide-react';
import { LeaveBalanceSummary } from '../../types/leave';

interface LeaveBalanceCardProps {
  balance?: LeaveBalanceSummary;
  loading?: boolean;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balance, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse shadow-card" />
        ))}
      </div>
    );
  }

  const paid = balance?.paid_leave || { total: 18, used: 0, available: 18 };
  const sick = balance?.sick_leave || { total: 12, used: 0, available: 12 };
  const unpaid = balance?.unpaid_leave || { used: 0, policy: 'As per policy' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="relative overflow-hidden rounded-2xl gradient-primary text-white p-6 shadow-soft-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-white/90">Paid Leave</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">
            Annual Quota
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">{paid.available}</span>
            <span className="text-sm font-medium text-white/80">Days Available</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-white/75 border-t border-white/15 pt-3">
            <span>Used: <strong>{paid.used} Days</strong></span>
            <span>Total: <strong>{paid.total} Days</strong></span>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-rose-500" />
            </div>
            <span className="font-semibold text-sm text-slate-800">Sick Leave</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Medical
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{sick.available}</span>
            <span className="text-sm font-medium text-slate-500">Days Available</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Used: <strong className="text-slate-700">{sick.used} Days</strong></span>
            <span>Total: <strong className="text-slate-700">{sick.total} Days</strong></span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <span className="font-semibold text-sm text-slate-800">Unpaid Leave</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Policy Based
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{unpaid.used}</span>
            <span className="text-sm font-medium text-slate-500">Days Taken</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Subject to approval & HR policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Calendar, Building } from 'lucide-react';
import { PayrollRecord } from '../../types/payroll';

interface SalarySummaryCardProps {
  payroll?: PayrollRecord;
  loading?: boolean;
}

export const SalarySummaryCard: React.FC<SalarySummaryCardProps> = ({ payroll, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card" />
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number | string | undefined) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const basic = payroll?.basic_salary || 0;
  const allowances = payroll?.total_allowances || 0;
  const deductions = payroll?.total_deductions || 0;
  const net = payroll?.net_salary || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Basic Salary</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(basic)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Fixed monthly component</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Allowances</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              +{formatCurrency(allowances)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">HRA, Travel, Medical</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Deductions</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-600 tracking-tight">
              -{formatCurrency(deductions)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">PF, Tax, Insurance</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl gradient-primary text-white p-5 shadow-soft-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">Net Salary (Take Home)</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(net)}
            </div>
            <span className="text-[11px] text-white/80 mt-1 block font-medium">Disbursed into verified account</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-card grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block">Bank Account</span>
            <span className="font-bold text-slate-800">{payroll?.bank_account_mask || '•••• •••• •••• 4921'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block">Disbursement Cycle</span>
            <span className="font-bold text-slate-800">{payroll?.pay_cycle || 'Monthly (28th of every month)'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block">Salary Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {payroll?.payment_status || 'Paid & Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

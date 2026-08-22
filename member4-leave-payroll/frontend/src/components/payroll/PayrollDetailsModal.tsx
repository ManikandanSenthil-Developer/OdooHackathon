import React from 'react';
import { X, DollarSign, Wallet, TrendingUp, TrendingDown, Building, Calendar } from 'lucide-react';
import { PayrollRecord } from '../../types/payroll';

interface PayrollDetailsModalProps {
  record: PayrollRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayrollDetailsModal: React.FC<PayrollDetailsModalProps> = ({ record, isOpen, onClose }) => {
  if (!isOpen || !record) return null;

  const formatCurrency = (val: number | string | undefined) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gradient-soft-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold">
              {record.employee_name ? record.employee_name.charAt(0) : 'E'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{record.employee_name}</h3>
              <p className="text-xs text-slate-500">{record.employee_id} • {record.designation || 'Staff'} ({record.department || 'General'})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl gradient-primary text-white shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 block mb-1">Monthly Net Salary</span>
            <div className="text-3xl font-extrabold tracking-tight">{formatCurrency(record.net_salary)}</div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-400" /> Basic Salary
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(record.basic_salary)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-emerald-800 font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Total Allowances
              </span>
              <span className="font-bold text-emerald-700">+{formatCurrency(record.total_allowances)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="text-rose-800 font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" /> Total Deductions
              </span>
              <span className="font-bold text-rose-700">-{formatCurrency(record.total_deductions)}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 space-y-1.5 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Payment Cycle:</span>
              <span className="font-semibold text-slate-800">{record.pay_cycle}</span>
            </div>
            <div className="flex justify-between">
              <span>Account:</span>
              <span className="font-semibold text-slate-800">{record.bank_account_mask || '•••• •••• •••• 4921'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

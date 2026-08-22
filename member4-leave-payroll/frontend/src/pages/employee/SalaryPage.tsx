import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, DollarSign, Lock } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { PayrollRecord } from '../../types/payroll';
import { SalarySummaryCard } from '../../components/payroll/SalarySummaryCard';
import { PaystubHistoryTable } from '../../components/payroll/PaystubHistoryTable';
import { ToastContainer } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export const SalaryPage: React.FC = () => {
  const [payroll, setPayroll] = useState<PayrollRecord | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toasts, removeToast } = useToast();

  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await payrollService.getMySalary();
      setPayroll(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to load salary details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Salary</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              <Lock className="w-3 h-3" /> Read-Only
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Review your compensation structure and monthly paystubs.</p>
        </div>

        <button
          onClick={fetchSalary}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchSalary}
            className="px-3 py-1 text-xs font-semibold text-rose-700 bg-white rounded-lg border border-rose-200 hover:bg-rose-50"
          >
            Retry
          </button>
        </div>
      )}

      <section>
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Salary Breakdown</h2>
        </div>
        <SalarySummaryCard payroll={payroll} loading={loading} />
      </section>

      <section>
        <PaystubHistoryTable paystubs={payroll?.paystubs} />
      </section>
    </div>
  );
};

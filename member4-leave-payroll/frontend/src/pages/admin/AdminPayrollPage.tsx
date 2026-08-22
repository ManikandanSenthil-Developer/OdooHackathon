import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, DollarSign, Users, Wallet, AlertCircle } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { PayrollRecord, UpdateSalaryPayload } from '../../types/payroll';
import { PayrollTable } from '../../components/payroll/PayrollTable';
import { SalaryEditModal } from '../../components/payroll/SalaryEditModal';
import { PayrollDetailsModal } from '../../components/payroll/PayrollDetailsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ToastContainer } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export const AdminPayrollPage: React.FC = () => {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const [editRecord, setEditRecord] = useState<PayrollRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<PayrollRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollService.getAllPayrolls({
        search: search || undefined,
        department: departmentFilter || undefined,
      });
      setPayrolls(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load employee payroll directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [departmentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayrolls();
  };

  const handleSaveSalary = async (employeeId: string, payload: UpdateSalaryPayload) => {
    setSaving(true);
    try {
      await payrollService.updateSalary(employeeId, payload);
      addToast('success', 'Salary Structure Updated', 'Net salary recalculated and database persisted.');
      await fetchPayrolls();
    } finally {
      setSaving(false);
    }
  };

  const totalMonthlyPayroll = payrolls.reduce((acc, curr) => acc + Number(curr.net_salary || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workforce Payroll Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage salary structures, deductions, allowances, and compensation accuracy.</p>
        </div>

        <button
          onClick={fetchPayrolls}
          disabled={loading}
          className="self-start md:self-auto p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Payrolls</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl gradient-primary text-white shadow-soft-lg flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Monthly Net Payroll Total</span>
          <div className="text-3xl font-extrabold tracking-tight mt-2">{formatCurrency(totalMonthlyPayroll)}</div>
          <span className="text-[11px] text-white/75 mt-2">Across all active department personnel</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Payroll Profiles</span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">{payrolls.length}</div>
          <span className="text-[11px] text-slate-400 mt-2">Verified employees on record</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Compensation</span>
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-2">
            {formatCurrency(payrolls.length ? Math.round(totalMonthlyPayroll / payrolls.length) : 0)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2">Per employee per month</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name, ID or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
          />
        </form>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-700 font-semibold w-full md:w-auto"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Regional Management">Regional Management</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>

      <section>
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : payrolls.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No payroll records found"
            description="There are no employee payroll structures configured under current search filters."
          />
        ) : (
          <PayrollTable
            records={payrolls}
            onEdit={(item) => setEditRecord(item)}
            onView={(item) => setViewRecord(item)}
          />
        )}
      </section>

      <SalaryEditModal
        record={editRecord}
        isOpen={!!editRecord}
        onClose={() => setEditRecord(null)}
        onSave={handleSaveSalary}
        saving={saving}
      />

      <PayrollDetailsModal
        record={viewRecord}
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
      />
    </div>
  );
};

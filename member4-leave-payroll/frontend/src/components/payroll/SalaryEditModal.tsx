import React, { useState, useEffect } from 'react';
import { X, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { PayrollRecord, UpdateSalaryPayload } from '../../types/payroll';

interface SalaryEditModalProps {
  record: PayrollRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeId: string, payload: UpdateSalaryPayload) => Promise<void>;
  saving: boolean;
}

export const SalaryEditModal: React.FC<SalaryEditModalProps> = ({
  record,
  isOpen,
  onClose,
  onSave,
  saving,
}) => {
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [effectiveFrom, setEffectiveFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setBasicSalary(Number(record.basic_salary) || 0);
      setAllowances(Number(record.total_allowances) || 0);
      setDeductions(Number(record.total_deductions) || 0);
      if (record.effective_from) {
        setEffectiveFrom(record.effective_from.split('T')[0]);
      }
      setFormError(null);
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const previewNetSalary = Math.max(0, basicSalary + allowances - deductions);
  const isInvalidNet = basicSalary + allowances - deductions < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (basicSalary < 0 || allowances < 0 || deductions < 0) {
      setFormError('Salary components cannot be negative numbers.');
      return;
    }

    if (isInvalidNet) {
      setFormError('Net salary cannot be negative (Deductions exceed earnings).');
      return;
    }

    try {
      await onSave(record.employee_id, {
        basic_salary: Number(basicSalary),
        total_allowances: Number(allowances),
        total_deductions: Number(deductions),
        effective_from: effectiveFrom,
      });
      onClose();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to update salary structure.');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gradient-soft-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Update Salary Structure</h3>
              <p className="text-xs text-slate-500">{record.employee_name} ({record.employee_id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Basic Salary (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              required
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Total Allowances (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Total Deductions (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-rose-700 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
            />
          </div>

          <div className="p-4 rounded-2xl gradient-primary text-white shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block">Calculated Net Salary</span>
              <span className="text-2xl font-extrabold tracking-tight">{formatCurrency(previewNetSalary)}</span>
            </div>
            <div className="text-right text-xs text-white/80">
              <span>Basic + Allowances − Deductions</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isInvalidNet}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 active:scale-95"
            >
              {saving ? 'Saving Changes...' : 'Save Salary Structure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

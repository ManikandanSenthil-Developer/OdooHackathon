import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, ShieldCheck } from "lucide-react";
import { PayrollRecord } from "../../types/payroll";

interface SalaryEditModalProps {
  isOpen: boolean;
  payroll: PayrollRecord | null;
  onClose: () => void;
  onSubmit: (employeeId: string, data: any) => Promise<void>;
}

export const SalaryEditModal: React.FC<SalaryEditModalProps> = ({
  isOpen,
  payroll,
  onClose,
  onSubmit,
}) => {
  const [basic, setBasic] = useState<number>(55000);
  const [allowances, setAllowances] = useState<number>(12000);
  const [deductions, setDeductions] = useState<number>(4500);
  const [payCycle, setPayCycle] = useState("Monthly (28th of every month)");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (payroll) {
      setBasic(Number(payroll.basic_salary) || 50000);
      setAllowances(Number(payroll.total_allowances) || 10000);
      setDeductions(Number(payroll.total_deductions) || 4000);
      setPayCycle(payroll.pay_cycle || "Monthly (28th of every month)");
      setPaymentStatus(payroll.payment_status || "Paid");
    }
    setError(null);
  }, [payroll, isOpen]);

  if (!isOpen || !payroll) return null;

  const gross = (Number(basic) || 0) + (Number(allowances) || 0);
  const netSalary = Math.max(0, gross - (Number(deductions) || 0));
  const isNegative = gross < (Number(deductions) || 0);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNegative) {
      setError("Deductions cannot exceed gross earnings.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(payroll.employee_id, {
        basic_salary: Number(basic),
        total_allowances: Number(allowances),
        total_deductions: Number(deductions),
        pay_cycle: payCycle,
        payment_status: paymentStatus,
      });
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update salary.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Salary Structure: {payroll.employee_name}
            </h3>
            <p className="text-xs text-slate-400">
              Employee ID: {payroll.employee_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-100 block mb-0.5">
                Calculated Monthly Net
              </span>
              <span className="text-2xl font-extrabold">
                {formatMoney(netSalary)}
              </span>
            </div>
            <ShieldCheck className="w-7 h-7 text-brand-100 opacity-80" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Basic Pay ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={basic}
                onChange={(e) => setBasic(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Allowances ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="250"
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
                Deductions ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 font-semibold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isNegative}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-sm shadow-brand-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryEditModal;

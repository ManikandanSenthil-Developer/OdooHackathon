import React, { useState, useEffect } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { payrollService } from "../../services/payrollService";
import { PayrollRecord } from "../../types/payroll";
import { SalarySummaryCard } from "../../components/payroll/SalarySummaryCard";
import { PaystubHistoryTable } from "../../components/payroll/PaystubHistoryTable";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const EmployeeSalaryPage: React.FC = () => {
  const { error } = useToast();

  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getMySalary();
      if (res.success) {
        setPayroll(res.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to load salary details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  if (loading && !payroll) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Compensation & Paystubs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review your compensation breakdown, monthly allowances, tax
            deductions, and download past payslips
          </p>
        </div>

        <button
          onClick={fetchSalary}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <SalarySummaryCard payroll={payroll} />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Disbursed Salary Paystubs
          </h3>
        </div>
        <PaystubHistoryTable paystubs={payroll?.paystubs || []} />
      </div>
    </div>
  );
};

export default EmployeeSalaryPage;

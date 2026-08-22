import React, { useState, useEffect } from "react";
import { Search, RefreshCw, DollarSign } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { payrollService } from "../../services/payrollService";
import { PayrollRecord } from "../../types/payroll";
import { PayrollTable } from "../../components/payroll/PayrollTable";
import { SalaryEditModal } from "../../components/payroll/SalaryEditModal";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";

export const AdminPayrollPage: React.FC = () => {
  const { success, error } = useToast();

  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [department, setDepartment] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(
    null,
  );

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getAllPayrolls({
        department: department === "ALL" ? undefined : department,
        search: search || undefined,
      });

      if (res.success) {
        setRecords(res.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to fetch payroll records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [department]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayrolls();
  };

  const handleUpdateSalary = async (employeeId: string, data: any) => {
    const res = await payrollService.updateSalaryStructure(employeeId, data);
    if (res.success) {
      success("Salary structure updated and net earnings recalculated!");
      fetchPayrolls();
    }
  };

  const totalBudget = records.reduce(
    (sum, r) => sum + Number(r.net_salary || 0),
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Workforce Payroll Administration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
              August 2026 Cycle
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain salary structures, configure allowances & deductions, and
            oversee compensation disbursements
          </p>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Monthly Payroll Allocation
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search employee by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Management">Management</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>

          <button
            onClick={fetchPayrolls}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        <PayrollTable
          records={records}
          onEdit={(rec) => setEditingRecord(rec)}
        />
      )}

      <SalaryEditModal
        isOpen={Boolean(editingRecord)}
        payroll={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSubmit={handleUpdateSalary}
      />
    </div>
  );
};

export default AdminPayrollPage;

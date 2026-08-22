import React from "react";
import { Edit3 } from "lucide-react";
import { PayrollRecord } from "../../types/payroll";
import { StatusBadge } from "../common/StatusBadge";

interface PayrollTableProps {
  records: PayrollRecord[];
  onEdit: (record: PayrollRecord) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  onEdit,
}) => {
  const formatMoney = (val: number | string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val));
  };

  if (!records || records.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h4 className="text-sm font-bold text-slate-700">
          No payroll records found
        </h4>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Employee</th>
              <th className="py-3.5 px-6">Department</th>
              <th className="py-3.5 px-6">Basic Salary</th>
              <th className="py-3.5 px-6">Allowances</th>
              <th className="py-3.5 px-6">Deductions</th>
              <th className="py-3.5 px-6">Net Salary</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {records.map((rec) => (
              <tr
                key={rec.id || rec.employee_id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 font-bold text-xs flex items-center justify-center">
                      {rec.employee_name ? rec.employee_name.charAt(0) : "E"}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs">
                        {rec.employee_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {rec.employee_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                  {rec.department || "--"}
                </td>
                <td className="py-4 px-6 text-xs text-slate-700 font-medium">
                  {formatMoney(rec.basic_salary)}
                </td>
                <td className="py-4 px-6 text-xs text-emerald-600 font-semibold">
                  +{formatMoney(rec.total_allowances)}
                </td>
                <td className="py-4 px-6 text-xs text-rose-600 font-semibold">
                  -{formatMoney(rec.total_deductions)}
                </td>
                <td className="py-4 px-6 text-xs font-extrabold text-brand-600">
                  {formatMoney(rec.net_salary)}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge
                    status={rec.payment_status || "Paid"}
                    size="sm"
                  />
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onEdit(rec)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollTable;

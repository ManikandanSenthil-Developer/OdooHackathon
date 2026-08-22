import React from 'react';
import { Edit3, Eye } from 'lucide-react';
import { PayrollRecord } from '../../types/payroll';

interface PayrollTableProps {
  records: PayrollRecord[];
  onEdit: (record: PayrollRecord) => void;
  onView: (record: PayrollRecord) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ records, onEdit, onView }) => {
  const formatCurrency = (val: number | string | undefined) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-5">Employee</th>
              <th className="py-3.5 px-4">Basic Salary</th>
              <th className="py-3.5 px-4">Allowances</th>
              <th className="py-3.5 px-4">Deductions</th>
              <th className="py-3.5 px-4">Net Salary</th>
              <th className="py-3.5 px-4">Effective Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((item) => (
              <tr key={item.id} className="hover:bg-brand-50/30 transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {item.employee_name ? item.employee_name.charAt(0) : 'E'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{item.employee_name}</div>
                      <div className="text-xs text-slate-400">{item.employee_id} {item.department ? '• ' + item.department : ''}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-800">
                  {formatCurrency(item.basic_salary)}
                </td>
                <td className="py-4 px-4 text-emerald-600 font-semibold">
                  +{formatCurrency(item.total_allowances)}
                </td>
                <td className="py-4 px-4 text-rose-600 font-semibold">
                  -{formatCurrency(item.total_deductions)}
                </td>
                <td className="py-4 px-4 font-extrabold text-brand-600 text-base">
                  {formatCurrency(item.net_salary)}
                </td>
                <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(item.effective_from)}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="View Breakdown"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-white gradient-primary hover:opacity-95 shadow-xs transition-all active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Salary
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from 'react';
import { Download, FileText } from 'lucide-react';
import { SalaryPaystub } from '../../types/payroll';
import { StatusBadge } from '../common/StatusBadge';

interface PaystubHistoryTableProps {
  paystubs?: SalaryPaystub[];
}

export const PaystubHistoryTable: React.FC<PaystubHistoryTableProps> = ({ paystubs = [] }) => {
  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Paystubs</h3>
          <p className="text-xs text-slate-500">Official monthly compensation disbursements (Read-Only)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-6">Payroll Month</th>
              <th className="py-3.5 px-4">Disbursed Amount</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4 text-right">Statement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paystubs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                  No previous paystubs on record.
                </td>
              </tr>
            ) : (
              paystubs.map((stub) => (
                <tr key={stub.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                      <FileText className="w-4 h-4 text-brand-500" />
                      {stub.month}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">
                    {formatCurrency(stub.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={stub.status || 'Paid'} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert('Downloading paystub for ' + stub.month + '...')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Paystub PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

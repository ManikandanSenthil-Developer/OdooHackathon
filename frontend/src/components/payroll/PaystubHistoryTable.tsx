import React from "react";
import { Download, FileText } from "lucide-react";
import { Paystub } from "../../types/payroll";
import { StatusBadge } from "../common/StatusBadge";

interface PaystubHistoryTableProps {
  paystubs: Paystub[];
}

export const PaystubHistoryTable: React.FC<PaystubHistoryTableProps> = ({
  paystubs,
}) => {
  const formatMoney = (val: number | string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val));
  };

  if (!paystubs || paystubs.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-700">
          No paystubs generated yet
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
              <th className="py-3.5 px-6">Pay Period / Month</th>
              <th className="py-3.5 px-6">Disbursed Amount</th>
              <th className="py-3.5 px-6">Disbursement Date</th>
              <th className="py-3.5 px-6">Payment Status</th>
              <th className="py-3.5 px-6 text-right">Download Payslip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paystubs.map((stub) => (
              <tr
                key={stub.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-4 px-6 font-bold text-slate-800 text-xs">
                  {stub.month}
                </td>
                <td className="py-4 px-6 font-bold text-brand-600 text-xs">
                  {formatMoney(stub.amount)}
                </td>
                <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                  {new Date(stub.disbursed_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={stub.status || "Paid"} size="sm" />
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() =>
                      alert(`Downloading Payslip for ${stub.month}`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
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

export default PaystubHistoryTable;

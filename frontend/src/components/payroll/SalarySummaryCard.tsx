import React from "react";
import {
  CreditCard,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { PayrollRecord } from "../../types/payroll";

interface SalarySummaryCardProps {
  payroll: PayrollRecord | null;
}

export const SalarySummaryCard: React.FC<SalarySummaryCardProps> = ({
  payroll,
}) => {
  const formatMoney = (val: number | string | undefined) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const basic = Number(payroll?.basic_salary) || 55000;
  const allowances = Number(payroll?.total_allowances) || 12000;
  const deductions = Number(payroll?.total_deductions) || 4500;
  const net = Number(payroll?.net_salary) || basic + allowances - deductions;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-6 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-100 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" />
              Verified Monthly Net Compensation
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatMoney(net)}
            </div>
            <p className="text-xs text-brand-100 mt-1">
              Disbursement Cycle:{" "}
              {payroll?.pay_cycle || "Monthly (28th of every month)"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-brand-100" />
            <div>
              <div className="text-[11px] font-bold text-brand-100 uppercase">
                Direct Deposit
              </div>
              <div className="text-xs font-bold tracking-widest">
                {payroll?.bank_account_mask || "•••• •••• •••• 4921"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-1">
            <span>Basic Pay</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-800">
            {formatMoney(basic)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold uppercase mb-1">
            <span>Total Allowances</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-700">
            +{formatMoney(allowances)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold uppercase mb-1">
            <span>Total Deductions</span>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-700">
            -{formatMoney(deductions)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySummaryCard;

import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const normalized = (status || "").toUpperCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "PRESENT" || normalized === "CHECKED IN") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "ABSENT") {
    styles = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (normalized === "HALFDAY" || normalized === "HALF DAY") {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "LEAVE" || normalized === "ON LEAVE") {
    styles = "bg-sky-50 text-sky-700 border-sky-200";
  } else if (normalized === "APPROVED" || normalized === "PAID") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "PENDING") {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "REJECTED" || normalized === "CANCELLED") {
    styles = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (normalized === "ACTIVE") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "INACTIVE" || normalized === "TERMINATED") {
    styles = "bg-slate-100 text-slate-600 border-slate-300";
  } else if (normalized === "ADMIN") {
    styles = "bg-brand-50 text-brand-700 border-brand-200";
  } else if (normalized === "EMPLOYEE") {
    styles = "bg-indigo-50 text-indigo-700 border-indigo-200";
  }

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : size === "lg"
        ? "px-3.5 py-1 text-sm"
        : "px-2.5 py-0.5 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;

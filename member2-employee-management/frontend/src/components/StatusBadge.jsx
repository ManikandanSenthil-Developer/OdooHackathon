import React from 'react';

const statusConfig = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  ON_LEAVE: {
    label: 'On Leave',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  PROBATION: {
    label: 'Probation',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500'
  },
  TERMINATED: {
    label: 'Inactive',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400'
  }
};

export default function StatusBadge({ status = 'ACTIVE', showDot = true, className = '' }) {
  const config = statusConfig[status] || statusConfig.ACTIVE;

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${config.bg} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />}
      <span>{config.label}</span>
    </span>
  );
}

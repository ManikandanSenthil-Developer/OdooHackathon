import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 mb-4 border border-brand-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white gradient-primary hover:opacity-95 shadow-sm transition-all active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

import React from 'react';
import { FolderOpen, Users, FileText, Search } from 'lucide-react';

const iconMap = {
  documents: FileText,
  employees: Users,
  search: Search,
  default: FolderOpen
};

export default function EmptyState({
  iconType = 'default',
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  className = ''
}) {
  const IconComponent = iconMap[iconType] || iconMap.default;

  return (
    <div
      id={`empty-state-${iconType}`}
      className={`dayflow-card p-10 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center mb-4">
        <IconComponent className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary text-sm px-4 py-2"
          id="empty-state-action-btn"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

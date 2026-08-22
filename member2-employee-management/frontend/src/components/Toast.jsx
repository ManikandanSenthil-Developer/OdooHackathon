import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      id="dayflow-toast"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-200 ${
        isError
          ? 'bg-red-50 text-red-900 border-red-200'
          : 'bg-[#F0FDF4] text-emerald-900 border-emerald-200'
      }`}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
      )}
      <p className="text-sm font-medium pr-2">{toast.message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

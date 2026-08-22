import React from "react";

interface LoadingSkeletonProps {
  type?: "card" | "table" | "profile" | "stats";
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = "card",
  count = 3,
}) => {
  if (type === "table") {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100/70 border-b border-slate-100" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200/70" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200/80 rounded w-1/4" />
              <div className="h-2.5 bg-slate-100 rounded w-1/3" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="h-7 bg-slate-300 rounded w-28" />
            <div className="h-2.5 bg-slate-100 rounded w-36" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-slate-200" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-200 rounded w-48" />
            <div className="h-3.5 bg-slate-100 rounded w-32" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="h-16 bg-slate-50 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

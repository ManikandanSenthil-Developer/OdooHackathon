import React from 'react';

/**
 * Skeleton loading placeholder for Employee Profile page
 */
export function ProfileSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse" id="profile-skeleton">
      {/* Header Skeleton */}
      <div className="dayflow-card p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-3 text-center md:text-left w-full">
          <div className="h-7 bg-slate-200 rounded-lg w-48 mx-auto md:mx-0" />
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto md:mx-0" />
          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
            <div className="h-6 bg-slate-200 rounded-full w-24" />
            <div className="h-6 bg-slate-200 rounded-full w-28" />
          </div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-32" />
      </div>

      {/* Grid of sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dayflow-card p-6 space-y-4">
          <div className="h-5 bg-slate-200 rounded w-40" />
          <div className="space-y-3 pt-2">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>

        <div className="dayflow-card p-6 space-y-4">
          <div className="h-5 bg-slate-200 rounded w-36" />
          <div className="space-y-3 pt-2">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loading placeholder for Employee Table
 */
export function TableSkeletonLoader({ rows = 5 }) {
  return (
    <div className="dayflow-card overflow-hidden" id="table-skeleton">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-36" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
            </div>
            <div className="hidden sm:block space-y-1">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-3 bg-slate-100 rounded w-20" />
            </div>
            <div className="hidden md:block h-6 bg-slate-100 rounded-full w-20" />
            <div className="h-8 bg-slate-200 rounded-lg w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loading placeholder for Document list
 */
export function DocumentSkeletonLoader() {
  return (
    <div className="space-y-3 animate-pulse" id="doc-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-44" />
              <div className="h-3 bg-slate-100 rounded w-28" />
            </div>
          </div>
          <div className="h-8 bg-slate-200 rounded-lg w-16" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({ message = 'Loading employee profile...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center" id="loading-state">
      <div className="relative w-12 h-12 mb-4">
        <div className="w-12 h-12 rounded-full border-3 border-[#E9F1FA] border-t-[#00ABE4] animate-spin" />
      </div>
      <p className="text-slate-600 font-medium text-sm">{message}</p>
    </div>
  );
}

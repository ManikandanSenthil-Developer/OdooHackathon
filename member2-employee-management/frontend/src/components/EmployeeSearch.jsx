import React, { useState, useEffect } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';

const DEPARTMENTS = ['ALL', 'Engineering', 'Design', 'Human Resources', 'Finance', 'Marketing', 'Operations'];
const STATUSES = ['ALL', 'ACTIVE', 'ON_LEAVE', 'PROBATION', 'TERMINATED'];

export default function EmployeeSearch({
  searchQuery = '',
  selectedDepartment = 'ALL',
  selectedStatus = 'ALL',
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onReset
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input by 300ms as requested in Section 16
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  const hasActiveFilters = localSearch || selectedDepartment !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="dayflow-card p-4 space-y-3 bg-white" id="employee-search-bar">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search text input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by name, ID (e.g. EMP-1001), email, role..."
            className="dayflow-input pl-10 pr-9 w-full text-sm placeholder:text-slate-400"
            id="employee-search-input"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Select */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="dayflow-input text-xs py-2 px-3 bg-white"
              id="department-filter-select"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="dayflow-input text-xs py-2 px-3 bg-white"
              id="status-filter-select"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                if (onReset) onReset();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

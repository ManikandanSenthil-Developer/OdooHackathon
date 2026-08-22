import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Building2, UserCheck, CalendarPlus, Search, Shield, RefreshCw } from 'lucide-react';
import { getEmployees, getEmployeeStats, deleteEmployee } from '../services/employeeApi';
import EmployeeSearch from '../components/EmployeeSearch';
import EmployeeTable from '../components/EmployeeTable';
import ErrorState from '../components/ErrorState';
import Toast from '../components/Toast';

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentsCount: 0,
    recentlyAddedCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Search, filter, pagination state
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load summary stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const statsData = await getEmployeeStats();
      setStats(statsData);
    } catch (err) {
      console.warn('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load employees from API
  const fetchEmployeeList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees({
        search,
        department,
        status,
        page,
        limit: 8
      });
      setEmployees(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Unable to load employee directory.');
    } finally {
      setLoading(false);
    }
  }, [search, department, status, page]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchEmployeeList();
  }, [fetchEmployeeList]);

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    setPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('ALL');
    setStatus('ALL');
    setPage(1);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      setToast({ type: 'success', message: `Employee ${employeeId} has been deleted successfully.` });
      fetchEmployeeList();
      fetchStats();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete employee.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200" id="employee-directory-page">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" id="directory-page-title">
            Employee Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin directory, profile records, department rosters, and documentation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/employees/new"
            className="btn-primary inline-flex items-center gap-2"
            id="directory-add-employee-btn"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards (Section 14: subtle, non-oversized) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" id="directory-stats-grid">
        {/* Total Employees */}
        <div className="dayflow-card p-4 sm:p-5 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Employees</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1" id="stat-total-employees">
              {loadingStats ? '—' : stats.totalEmployees}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Employees */}
        <div className="dayflow-card p-4 sm:p-5 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Employees</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1" id="stat-active-employees">
              {loadingStats ? '—' : stats.activeEmployees}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Departments */}
        <div className="dayflow-card p-4 sm:p-5 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Departments</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1" id="stat-departments">
              {loadingStats ? '—' : stats.departmentsCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Recently Added */}
        <div className="dayflow-card p-4 sm:p-5 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Recently Added</span>
            <div className="text-xl sm:text-2xl font-bold text-[#007EA7] mt-1" id="stat-recent-added">
              {loadingStats ? '—' : stats.recentlyAddedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center shrink-0">
            <CalendarPlus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Debounced Search and Department / Status Filter Bar (Section 16) */}
      <EmployeeSearch
        searchQuery={search}
        selectedDepartment={department}
        selectedStatus={status}
        onSearchChange={handleSearchChange}
        onDepartmentChange={handleDepartmentChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      {/* Table / Error handling */}
      {error ? (
        <ErrorState
          title="Error loading employee directory"
          message={error}
          onRetry={fetchEmployeeList}
        />
      ) : (
        <EmployeeTable
          employees={employees}
          isLoading={loading}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onDeleteEmployee={handleDeleteEmployee}
        />
      )}
    </div>
  );
}

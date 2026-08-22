import React, { useState, useEffect } from "react";
import { UserPlus, Search, Filter, RefreshCw } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { employeeService } from "../../services/employeeService";
import { Employee } from "../../types/employee";
import { EmployeeTable } from "../../components/employees/EmployeeTable";
import { EmployeeForm } from "../../components/employees/EmployeeForm";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";
import { EmptyState } from "../../components/common/EmptyState";

export const EmployeeDirectoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();
  const isAdmin = currentUser?.role === "ADMIN";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getEmployees({
        page,
        limit: 10,
        search,
        department: department === "ALL" ? undefined : department,
      });

      if (res.success) {
        setEmployees(res.data);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err: any) {
      error(
        err.response?.data?.message || "Failed to fetch employee directory",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, department]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const handleFormSubmit = async (data: Partial<Employee>) => {
    if (editingEmployee) {
      const res = await employeeService.updateEmployee(
        editingEmployee.employee_id,
        data,
      );
      if (res.success) {
        success(`Updated profile for ${res.data.name}`);
        fetchEmployees();
      }
    } else {
      const res = await employeeService.createEmployee(data);
      if (res.success) {
        success(`Created employee account for ${res.data.name}`);
        fetchEmployees();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    try {
      const res = await employeeService.deleteEmployee(
        deletingEmployee.employee_id,
      );
      if (res.success) {
        success(`Deleted employee record for ${deletingEmployee.name}`);
        setDeletingEmployee(null);
        fetchEmployees();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Workforce Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
              {total} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, manage personnel profiles, and oversee organizational
            assignments
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add New Employee
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Management">Management</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <button
            onClick={fetchEmployees}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="Try modifying your search keywords or department filter."
          actionText={isAdmin ? "Add New Employee" : undefined}
          onAction={() => {
            setEditingEmployee(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div className="space-y-4">
          <EmployeeTable
            employees={employees}
            isAdmin={isAdmin}
            onEdit={(emp) => {
              setEditingEmployee(emp);
              setIsFormOpen(true);
            }}
            onDelete={(emp) => setDeletingEmployee(emp)}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 text-xs text-slate-500">
              <span>
                Page {page} of {totalPages} ({total} employees)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <EmployeeForm
        isOpen={isFormOpen}
        employee={editingEmployee}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingEmployee)}
        title="Delete Employee Record"
        message={`Are you sure you want to delete ${deletingEmployee?.name} (${deletingEmployee?.employee_id})? This action cannot be undone.`}
        confirmText="Delete Record"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingEmployee(null)}
      />
    </div>
  );
};

export default EmployeeDirectoryPage;

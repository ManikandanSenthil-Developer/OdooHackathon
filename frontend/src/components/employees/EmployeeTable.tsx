import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Building,
  Briefcase,
} from "lucide-react";
import { Employee } from "../../types/employee";
import { StatusBadge } from "../common/StatusBadge";

interface EmployeeTableProps {
  employees: Employee[];
  isAdmin?: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Employee</th>
              <th className="py-3.5 px-6">Role & Department</th>
              <th className="py-3.5 px-6">Contact Info</th>
              <th className="py-3.5 px-6">Joining Date</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {employees.map((emp) => (
              <tr
                key={emp.employee_id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {emp.profile_picture ? (
                      <img
                        src={emp.profile_picture}
                        alt={emp.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {emp.employee_id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {emp.designation}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {emp.department}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex flex-col text-xs text-slate-500 gap-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {emp.email}
                    </span>
                    {emp.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {emp.phone}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-6 text-slate-600 font-medium text-xs">
                  {emp.joining_date
                    ? new Date(emp.joining_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "--"}
                </td>

                <td className="py-4 px-6">
                  <StatusBadge status="ACTIVE" size="sm" />
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/employees/${emp.employee_id}`}
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {isAdmin && onEdit && (
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Employee"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    {isAdmin && onDelete && (
                      <button
                        onClick={() => onDelete(emp)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;

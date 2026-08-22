import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Search, UserCheck, UserMinus, Users } from 'lucide-react';
import { AttendanceRecord, attendanceApi } from '../../services/attendance.api';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';

export const AdminAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    attendanceApi.getAll({ date: date || undefined })
      .then((response) => setRecords(response.data))
      .catch((reason: any) => setError(reason.response?.data?.message || 'Unable to load attendance records.'))
      .finally(() => setLoading(false));
  }, [date]);

  const filteredRecords = useMemo(() => {
    const query = employeeSearch.toLowerCase().trim();
    return query ? records.filter((record) => `${record.employee?.name || ''} ${record.employee?.email || ''} ${record.employeeId}`.toLowerCase().includes(query)) : records;
  }, [employeeSearch, records]);

  const stats = { present: records.filter((record) => record.status === 'PRESENT').length, halfDay: records.filter((record) => record.status === 'HALFDAY').length, leave: records.filter((record) => record.status === 'LEAVE').length };

  return <main className="min-h-screen bg-[#E9F1FA] px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl space-y-6"><header><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00ABE4]">HR operations</p><h1 className="mt-2 text-3xl font-bold text-[#1F2937]">Attendance management</h1></header><div className="grid gap-4 sm:grid-cols-3"><Stat icon={<UserCheck />} label="Present" value={stats.present} color="text-emerald-600" /><Stat icon={<Users />} label="Half-day" value={stats.halfDay} color="text-amber-600" /><Stat icon={<UserMinus />} label="Leave" value={stats.leave} color="text-violet-600" /></div><section className="rounded-xl bg-white p-4 shadow-lg shadow-slate-200/40"><div className="grid gap-3 md:grid-cols-[1fr_220px]"><label className="relative"><Search size={18} className="absolute left-3 top-3 text-slate-400" /><input value={employeeSearch} onChange={(event) => setEmployeeSearch(event.target.value)} placeholder="Search employee" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#00ABE4]" /></label><label className="relative"><CalendarDays size={18} className="absolute left-3 top-3 text-slate-400" /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-[#00ABE4]" /></label></div></section>{error && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{loading ? <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-lg">Loading attendance records...</div> : <AttendanceTable records={filteredRecords} showEmployee />}</div></main>;
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => <div className="rounded-xl bg-white p-5 shadow-lg shadow-slate-200/40"><div className={`flex items-center gap-2 text-sm font-bold ${color}`}>{icon}<span>{label}</span></div><p className="mt-3 text-3xl font-bold text-[#1F2937]">{value}</p></div>;
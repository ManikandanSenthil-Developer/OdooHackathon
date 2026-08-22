import React, { useEffect, useState } from 'react';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { AttendanceRecord, attendanceApi } from '../../services/attendance.api';

export const WeeklyAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attendanceApi.getWeek()
      .then((response) => setRecords(response.data))
      .catch((reason: any) => setError(reason.response?.data?.message || 'Unable to load weekly attendance.'))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-[#E9F1FA] px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl space-y-6"><header><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00ABE4]">Attendance history</p><h1 className="mt-2 text-3xl font-bold text-[#1F2937]">Last seven days</h1></header>{error && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{loading ? <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-lg">Loading weekly attendance...</div> : <AttendanceTable records={records} />}</div></main>;
};
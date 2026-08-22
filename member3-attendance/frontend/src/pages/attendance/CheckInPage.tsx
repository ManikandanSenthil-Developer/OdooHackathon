import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock3, LogIn, LogOut } from "lucide-react";
import {
  attendanceApi,
  AttendanceRecord,
} from "../../services/attendance.api";
import { AttendanceCard } from "../../components/attendance/AttendanceCard";
import { useAuth } from "../../hooks/useAuth";

export const CheckInPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [clock, setClock] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    attendanceApi
      .getToday()
      .then((res) => setAttendance(res.data))
      .catch((err) =>
        setMessage(err.response?.data?.message || "Unable to load attendance.")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (action: "checkIn" | "checkOut") => {
    setActionLoading(true);
    setMessage("");

    try {
      const res = await attendanceApi[action]();
      setAttendance(res.data);
      setMessage(
        action === "checkIn"
          ? "Check-in recorded successfully."
          : "Check-out recorded successfully."
      );
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Attendance action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const canCheckIn = !attendance;
  const canCheckOut = !!attendance?.checkIn && !attendance?.checkOut;

  return (
    <main className="min-h-screen bg-[#E9F1FA] px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00ABE4]">
            Attendance Desk
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">
            Good day, {currentUser?.name || "Employee"}
          </h1>

          <p className="mt-2 text-slate-600">
            {clock.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </header>

        <section className="rounded-xl bg-[#1F2937] p-6 text-white shadow-xl">
          <p className="flex items-center gap-2 text-sm text-slate-300">
            <Clock3 size={18} />
            Live Time
          </p>

          <h2 className="mt-2 text-5xl font-bold">
            {clock.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </h2>
        </section>

        {message && (
          <div className="rounded-xl bg-white p-4 text-sm font-medium shadow">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading attendance...
          </div>
        ) : (
          <>
            <AttendanceCard attendance={attendance} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={!canCheckIn || actionLoading}
                onClick={() => handleAction("checkIn")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00ABE4] px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                <LogIn size={18} />
                Check In
              </button>

              <button
                type="button"
                disabled={!canCheckOut || actionLoading}
                onClick={() => handleAction("checkOut")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1F2937] px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                <LogOut size={18} />
                Check Out
              </button>
            </div>
          </>
        )}

        {attendance?.checkOut && (
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            Your workday is complete.
          </div>
        )}
      </div>
    </main>
  );
};
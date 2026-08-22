import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "attendance" | "leaves" | "payroll" | "workforce"
  >("attendance");
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const [clockTime, setClockTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickLogin = async (role: "ADMIN" | "EMPLOYEE") => {
    try {
      setDemoLoading(role);
      const email =
        role === "ADMIN" ? "admin@dayflow.com" : "employee@dayflow.com";
      const password = role === "ADMIN" ? "Admin@123" : "Employee@123";
      const res = await authService.login({ email, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        navigate(res.user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard");
      }
    } catch {
      navigate("/login");
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-500/20 selection:text-brand-700">
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white text-xs font-semibold py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>
            Dayflow HRMS v2.0 is live with integrated Attendance, Leave
            Workflows & Automated Payroll.
          </span>
          <span className="hidden sm:inline-block">•</span>
          <Link
            to="/login"
            className="underline font-bold hover:text-brand-100 hidden sm:inline-block"
          >
            Launch Demo Portal →
          </Link>
        </div>
      </div>

      <header className="relative pt-12 pb-20 overflow-hidden bg-dayflow-hero border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-200 text-brand-700 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Unified Human Resource & Payroll Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Empower your workforce with{" "}
              <span className="bg-gradient-to-r from-brand-500 to-indigo-600 bg-clip-text text-transparent">
                intelligent HRMS
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Dayflow unifies employee records, real-time attendance tracking,
              leave quota governance, and seamless compensation control in one
              modern SaaS interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Sign In to Portal
              </Link>
            </div>

            <div className="pt-6">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                  Instant Demo Access:
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleQuickLogin("ADMIN")}
                    disabled={Boolean(demoLoading)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    {demoLoading === "ADMIN"
                      ? "Launching..."
                      : "Demo Admin / HR"}
                  </button>
                  <button
                    onClick={() => handleQuickLogin("EMPLOYEE")}
                    disabled={Boolean(demoLoading)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    {demoLoading === "EMPLOYEE"
                      ? "Launching..."
                      : "Demo Employee"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              Enterprise Grade Capabilities
            </h2>
            <h3 className="text-3xl font-black text-slate-900">
              Built for high-performance workforce operations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Role-Based Access Control
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Granular permission boundaries ensuring Employees access
                self-service tools while HR and Admins command workforce
                approval controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Real-Time Metrics
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live dashboard telemetry computing today’s attendance
                percentages, pending leave backlogs, and total departmental
                payroll expenditures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                High-Performance Architecture
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Engineered with React 18, Vite, TypeScript, and Prisma ORM for
                instantaneous page renders, reliable schema constraints, and
                offline resilience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

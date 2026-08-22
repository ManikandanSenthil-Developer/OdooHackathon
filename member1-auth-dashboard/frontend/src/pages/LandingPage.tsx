import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* HERO SECTION */}
        <section style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E9F1FA 100%)',
          padding: '80px 0 100px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(0, 171, 228, 0.1)',
                  color: '#00ABE4',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '24px'
                }}>
                  <Sparkles size={16} /> Enterprise HRMS Platform 2026
                </div>

                <h1 style={{
                  fontSize: '3.4rem',
                  lineHeight: '1.15',
                  fontWeight: 800,
                  color: '#1F2937',
                  marginBottom: '24px',
                  letterSpacing: '-0.03em'
                }}>
                  Every workday, <span style={{ color: '#00ABE4' }}>perfectly aligned.</span>
                </h1>

                <p style={{
                  fontSize: '1.2rem',
                  color: '#4B5563',
                  marginBottom: '36px',
                  lineHeight: '1.6',
                  maxWidth: '540px'
                }}>
                  Manage employees, attendance, leaves and payroll with a smart HR management platform.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                    Get Started <ArrowRight size={18} />
                  </Link>
                  <a href="#features" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                    Documentation
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(0, 171, 228, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#00ABE4" /> JWT Secured
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#00ABE4" /> Role-Based Access
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#00ABE4" /> Real-time Analytics
                  </div>
                </div>
              </div>

              {/* HR Illustration / Preview Mockup Card */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 25px 50px -12px rgba(0, 171, 228, 0.2)',
                  border: '1px solid rgba(0, 171, 228, 0.15)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E9F1FA', color: '#00ABE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Dayflow Workforce Radar</h4>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Live HR Telemetry</p>
                      </div>
                    </div>
                    <span className="badge badge-success">98.5% Present</span>
                  </div>

                  {/* Sample Interactive Stat Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Active Employees</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>248</div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <TrendingUp size={12} /> +12 this month
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Payroll Disbursed</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00ABE4', marginTop: '4px' }}>$148,500</div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <CheckCircle2 size={12} /> Auto-processed
                      </div>
                    </div>
                  </div>

                  {/* Activity List Preview */}
                  <div style={{ background: '#E9F1FA', padding: '16px', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>Recent Approval Requests</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#FFFFFF', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <span>Annual Leave Request (Sarah C.)</span>
                      <span className="badge badge-warning">Pending Review</span>
                    </div>
                  </div>
                </div>

                {/* Decorative background glow circle */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: 'rgba(0, 171, 228, 0.15)',
                  filter: 'blur(60px)',
                  zIndex: 1
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" style={{ padding: '90px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px auto' }}>
              <span style={{ color: '#00ABE4', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Complete HR Solution
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', marginBottom: '16px' }}>
                Everything your organization needs in one place
              </h2>
              <p style={{ color: '#6B7280', fontSize: '1.05rem' }}>
                Streamline core HR operations, automate attendance tracking, and empower your workforce with self-service employee portals.
              </p>
            </div>

            <div className="grid-4">
              <div className="card" style={{ textAlign: 'left', padding: '30px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#E9F1FA', color: '#00ABE4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Employee Records</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Centralized database for employee profiles, job titles, department assignments, and contact details.
                </p>
              </div>

              <div className="card" style={{ textAlign: 'left', padding: '30px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#E9F1FA', color: '#00ABE4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Clock size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Attendance Tracking</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Real-time clock-in/clock-out telemetry with work hour logging and attendance metrics.
                </p>
              </div>

              <div className="card" style={{ textAlign: 'left', padding: '30px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#E9F1FA', color: '#00ABE4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Calendar size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Leave Approvals</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Seamless leave application workflow for casual, sick, and paid leaves with admin approve/reject actions.
                </p>
              </div>

              <div className="card" style={{ textAlign: 'left', padding: '30px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#E9F1FA', color: '#00ABE4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <DollarSign size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Salary & Payroll</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Automated monthly payroll disbursement, downloadable paystubs, and compensation breakdowns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY & CTA SECTION */}
        <section style={{ padding: '80px 0', backgroundColor: '#E9F1FA' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
              borderRadius: '24px',
              padding: '60px 40px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '30px',
              boxShadow: '0 20px 40px rgba(0, 171, 228, 0.15)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00ABE4', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
                  <ShieldCheck size={20} /> Bank-Grade Authentication & RBAC
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
                  Ready to align your organization?
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '1.05rem', maxWidth: '500px' }}>
                  Sign up today as an Employee or Admin HR Officer and experience modern HR management.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  Create Free Account <Zap size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem', background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', padding: '30px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            © 2026 <strong>DAYFLOW HRMS</strong>. All rights reserved. Powered by React, Express, Prisma & MySQL.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: '#6B7280' }}>Login</Link>
            <Link to="/signup" style={{ color: '#6B7280' }}>Signup</Link>
            <a href="#features" style={{ color: '#6B7280' }}>Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

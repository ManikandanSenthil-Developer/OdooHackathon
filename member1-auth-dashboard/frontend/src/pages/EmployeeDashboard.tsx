import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { DashboardCard } from '../components/DashboardCard';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import {
  User as UserIcon,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Briefcase,
  Download,
  Activity,
  FileText
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Clock In/Out state
  const [clockedIn, setClockedIn] = useState(true);
  const [clockTime, setClockTime] = useState('09:00 AM');

  // Interactive Leave Modal / Form state
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const res = await authService.getEmployeeDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load employee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleClockToggle = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (clockedIn) {
      setClockedIn(false);
      setClockTime(now);
    } else {
      setClockedIn(true);
      setClockTime(now);
    }
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !leaveDate) return;

    const newRequest = {
      id: `LR-${Math.floor(100 + Math.random() * 900)}`,
      type: leaveType,
      dates: leaveDate,
      reason: leaveReason,
      status: 'Pending',
    };

    if (data?.leaveRequests) {
      setData({
        ...data,
        leaveRequests: {
          ...data.leaveRequests,
          recentRequests: [newRequest, ...data.leaveRequests.recentRequests],
        },
      });
    }

    setLeaveSuccess('Leave request submitted successfully for approval!');
    setLeaveReason('');
    setLeaveDate('');
    setShowLeaveForm(false);
    setTimeout(() => setLeaveSuccess(null), 4000);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <p style={{ color: '#00ABE4', fontWeight: 700 }}>Loading Employee Dashboard...</p>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const attendance = data?.attendance;
  const leaveRequests = data?.leaveRequests;
  const salary = data?.salary;

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '40px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #00ABE4 0%, #0077B6 100%)',
            borderRadius: '20px',
            padding: '32px 36px',
            color: '#FFFFFF',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(0, 171, 228, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-employee" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}>
                  EMPLOYEE PORTAL
                </span>
                <span style={{ fontSize: '0.85rem', color: '#E9F1FA' }}>
                  ID: {profile?.employeeId || 'EMP-104'}
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', color: '#FFFFFF', fontWeight: 800 }}>
                Welcome, {currentUser?.name || profile?.name} 👋
              </h1>
              <p style={{ color: '#E9F1FA', fontSize: '1rem', marginTop: '4px' }}>
                Here is your daily workday summary, attendance status, and leave balances.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px 20px',
                borderRadius: '14px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#E9F1FA', fontWeight: 700 }}>
                  Attendance Rate
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {attendance?.monthlyAttendanceRate || 98.5}%
                </div>
              </div>
            </div>
          </div>

          {leaveSuccess && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{leaveSuccess}</span>
            </div>
          )}

          {/* DASHBOARD CARDS GRID */}
          <div className="grid-2" style={{ marginBottom: '28px' }}>
            {/* CARD 1: PROFILE */}
            <DashboardCard
              title="Employee Profile"
              subtitle="Personal & Organization Details"
              icon={<UserIcon size={22} />}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#00ABE4',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800
                  }}>
                    {(currentUser?.name || profile?.name || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{currentUser?.name || profile?.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{currentUser?.email}</p>
                    <span className="badge badge-employee" style={{ marginTop: '4px' }}>
                      {profile?.jobTitle || 'Software Engineer'}
                    </span>
                  </div>
                </div>

                <div className="grid-2">
                  <div style={{ border: '1px solid #E5E7EB', padding: '12px 14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Department</span>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2937', marginTop: '2px' }}>
                      {profile?.department}
                    </p>
                  </div>
                  <div style={{ border: '1px solid #E5E7EB', padding: '12px 14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Joining Date</span>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2937', marginTop: '2px' }}>
                      {profile?.joinDate}
                    </p>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* CARD 2: ATTENDANCE */}
            <DashboardCard
              title="Attendance Telemetry"
              subtitle="Daily Check-in & Work Hours Log"
              icon={<Clock size={22} />}
              headerAction={
                <button
                  onClick={handleClockToggle}
                  className={`btn ${clockedIn ? 'btn-danger' : 'btn-primary'}`}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  {clockedIn ? 'Clock Out' : 'Clock In'}
                </button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: clockedIn ? '#ECFDF5' : '#FFFBEB',
                  borderRadius: '12px',
                  border: `1px solid ${clockedIn ? '#6EE7B7' : '#FDE68A'}`
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Today's Status</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: clockedIn ? '#047857' : '#B45309' }}>
                      {clockedIn ? 'ACTIVE (Checked In)' : 'OFF-DUTY (Checked Out)'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Recorded Time</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{clockTime}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937' }}>Recent Attendance Activity</div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance?.recentLogs?.map((log: any, idx: number) => (
                        <tr key={idx}>
                          <td>{log.date}</td>
                          <td>
                            <span className={`badge ${log.status === 'Present' ? 'badge-success' : 'badge-warning'}`}>
                              {log.status}
                            </span>
                          </td>
                          <td>{log.checkIn}</td>
                          <td>{log.checkOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid-2">
            {/* CARD 3: LEAVE REQUESTS */}
            <DashboardCard
              title="Leave Requests"
              subtitle="Leave Allowances & Application History"
              icon={<Calendar size={22} />}
              headerAction={
                <button
                  onClick={() => setShowLeaveForm(!showLeaveForm)}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <PlusCircle size={14} /> {showLeaveForm ? 'Close Form' : 'Apply Leave'}
                </button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Leave balances */}
                <div className="grid-3">
                  <div style={{ background: '#E9F1FA', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#00ABE4', fontWeight: 700 }}>Casual Leave</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937' }}>
                      {leaveRequests?.casualLeavesAvailable} Days
                    </div>
                  </div>
                  <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>Sick Leave</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937' }}>
                      {leaveRequests?.sickLeavesAvailable} Days
                    </div>
                  </div>
                  <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700 }}>Paid Leave</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937' }}>
                      {leaveRequests?.paidLeavesAvailable} Days
                    </div>
                  </div>
                </div>

                {/* Optional Apply Leave Form */}
                {showLeaveForm && (
                  <form onSubmit={handleApplyLeave} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #00ABE4' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>New Leave Application</h4>
                    <div className="form-group">
                      <label className="form-label">Leave Type</label>
                      <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Paid Leave">Paid Leave</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date(s)</label>
                      <input type="text" className="form-input" placeholder="e.g. Sep 10, 2026" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reason</label>
                      <input type="text" className="form-input" placeholder="Brief explanation..." value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" style={{ padding: '10px' }}>
                      Submit Request
                    </button>
                  </form>
                )}

                {/* History table */}
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests?.recentRequests?.map((req: any, idx: number) => (
                        <tr key={idx}>
                          <td>
                            <strong>{req.type}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{req.reason}</div>
                          </td>
                          <td>{req.dates}</td>
                          <td>
                            <span className={`badge ${req.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DashboardCard>

            {/* CARD 4: SALARY */}
            <DashboardCard
              title="Salary & Paystubs"
              subtitle="Monthly Earnings & Payment Records"
              icon={<DollarSign size={22} />}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>Estimated Net Monthly Pay</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00ABE4', marginTop: '2px' }}>
                    {salary?.netPay}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4B5563', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E5E7EB' }}>
                    <span>Base: {salary?.basePay}</span>
                    <span>Bonus: {salary?.bonus}</span>
                    <span>Deductions: -{salary?.deductions}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937' }}>Recent Paystubs</div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salary?.recentPaystubs?.map((stub: any, idx: number) => (
                        <tr key={idx}>
                          <td>{stub.month}</td>
                          <td><strong>{stub.amount}</strong></td>
                          <td>
                            <span className="badge badge-success">{stub.status}</span>
                          </td>
                          <td>
                            <button
                              onClick={() => alert(`Downloading Paystub for ${stub.month}...`)}
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              <Download size={12} /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
};

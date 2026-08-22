import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { DashboardCard } from '../components/DashboardCard';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import {
  Shield,
  Users,
  Clock,
  CalendarCheck,
  DollarSign,
  CheckCircle,
  XCircle,
  TrendingUp,
  UserCheck,
  Award,
  Search,
  Filter
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [leaves, setLeaves] = useState<any[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await authService.getAdminDashboard();
        if (res.success) {
          setData(res.data);
          setLeaves(res.data.leaveApprovals || []);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleApproveLeave = (id: string, name: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
    setActionNotice(`Approved leave request for ${name}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRejectLeave = (id: string, name: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l)));
    setActionNotice(`Rejected leave request for ${name}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <p style={{ color: '#00ABE4', fontWeight: 700 }}>Loading Admin Portal Telemetry...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const users = data?.users || [];
  const attendanceSummary = data?.attendanceSummary;
  const payrollOverview = data?.payrollOverview;

  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ padding: '40px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          {/* Executive Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            borderRadius: '20px',
            padding: '32px 36px',
            color: '#FFFFFF',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(31, 41, 55, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-admin">
                  <Shield size={12} /> HR OFFICER CONTROL ROOM
                </span>
                <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                  Authenticated: {currentUser?.email}
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', color: '#FFFFFF', fontWeight: 800 }}>
                Dayflow Admin Command Center
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '1rem', marginTop: '4px' }}>
                System-wide metrics, workforce management, leave approvals, and payroll compliance.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => alert('Generating HR Compliance Report...')}>
                Generate HR Report
              </button>
            </div>
          </div>

          {actionNotice && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* OVERVIEW STATS ROW */}
          <div className="grid-4" style={{ marginBottom: '28px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 700 }}>TOTAL USERS</span>
                <Users size={20} color="#00ABE4" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1F2937', marginTop: '8px' }}>
                {stats?.totalEmployees || users.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>
                {stats?.employees || 0} Employees, {stats?.admins || 0} Admins
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 700 }}>PRESENT TODAY</span>
                <UserCheck size={20} color="#10B981" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '8px' }}>
                {stats?.presentTodayCount || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>
                {attendanceSummary?.onTimeRate || '96.2%'} On-time rate
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 700 }}>PENDING LEAVES</span>
                <CalendarCheck size={20} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '8px' }}>
                {leaves.filter((l) => l.status === 'Pending').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>
                Requires admin review
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 700 }}>MONTHLY PAYROLL</span>
                <DollarSign size={20} color="#00ABE4" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00ABE4', marginTop: '8px' }}>
                {stats?.monthlyPayrollTotal || '$148,500'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>
                Cycle: {payrollOverview?.currentCycle}
              </div>
            </div>
          </div>

          {/* MAIN ADMIN DASHBOARD CARDS GRID */}
          <div className="grid-2" style={{ marginBottom: '28px' }}>
            {/* CARD 1: EMPLOYEES DIRECTORY */}
            <DashboardCard
              title="Workforce Directory"
              subtitle="Registered Users & System Roles"
              icon={<Users size={22} />}
              headerAction={
                <div style={{ position: 'relative', width: '200px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9CA3AF' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '32px', padding: '6px 10px 6px 32px', fontSize: '0.8rem' }}
                  />
                </div>
              }
            >
              <div className="table-container" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user: any) => (
                        <tr key={user.id}>
                          <td>
                            <strong>{user.name}</strong>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: '#4B5563' }}>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-employee'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#6B7280', padding: '24px' }}>
                          No users found matching search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </DashboardCard>

            {/* CARD 2: ATTENDANCE SUMMARY */}
            <DashboardCard
              title="Attendance Oversight"
              subtitle="Department Breakdown & Punctuality"
              icon={<Clock size={22} />}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Punctuality Index</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                      {attendanceSummary?.onTimeRate}
                    </div>
                  </div>
                  <div style={{ flex: 1, background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Late Arrivals</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                      {attendanceSummary?.lateArrivals} Employees
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937' }}>Department Attendance</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {attendanceSummary?.departmentBreakdown?.map((dept: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dept.department}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                          <strong>{dept.present}</strong> / {dept.total} Present
                        </span>
                        <div style={{ width: '80px', height: '8px', background: '#E9F1FA', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${(dept.present / dept.total) * 100}%`, height: '100%', background: '#00ABE4' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid-2">
            {/* CARD 3: LEAVE APPROVALS */}
            <DashboardCard
              title="Leave Approvals Workflow"
              subtitle="Review & Process Employee Leave Applications"
              icon={<CalendarCheck size={22} />}
            >
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((item: any) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.employeeName}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.department}</div>
                        </td>
                        <td>{item.type}</td>
                        <td>{item.dates}</td>
                        <td>
                          <span className={`badge ${
                            item.status === 'Approved'
                              ? 'badge-success'
                              : item.status === 'Rejected'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleApproveLeave(item.id, item.employeeName)}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#ECFDF5', color: '#10B981' }}
                                title="Approve"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectLeave(item.id, item.employeeName)}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#FEF2F2', color: '#EF4444' }}
                                title="Reject"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>

            {/* CARD 4: PAYROLL OVERVIEW */}
            <DashboardCard
              title="Payroll & Compensation Oversight"
              subtitle="Monthly Cycle & Disbursement Control"
              icon={<DollarSign size={22} />}
              headerAction={
                <button
                  onClick={() => alert('Payroll processing batch initiated!')}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Process Batch
                </button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#E9F1FA', padding: '20px', borderRadius: '12px', border: '1px solid #00ABE4' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#00ABE4', fontWeight: 700 }}>Current Pay Period</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1F2937', marginTop: '2px' }}>
                        {payrollOverview?.currentCycle}
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                      {payrollOverview?.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(0, 171, 228, 0.2)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total Disbursement</span>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00ABE4' }}>
                        {payrollOverview?.totalDisbursed}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Scheduled Payout</span>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1F2937' }}>
                        {payrollOverview?.nextPayoutDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <Award size={20} color="#00ABE4" />
                  <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                    All salary calculations include tax withholdings and standard HR deductions.
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
};

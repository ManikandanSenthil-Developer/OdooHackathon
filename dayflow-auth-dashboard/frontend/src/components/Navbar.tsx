import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, LogOut, User as UserIcon, Shield, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <nav style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00ABE4 0%, #0084B4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0, 171, 228, 0.3)'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1F2937', letterSpacing: '-0.03em' }}>
              DAYFLOW
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00ABE4', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HRMS
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        {isLandingPage && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ fontWeight: 600, color: '#4B5563', fontSize: '0.95rem' }}>Features</a>
            <a href="#hrmanagement" style={{ fontWeight: 600, color: '#4B5563', fontSize: '0.95rem' }}>HR Management</a>
            <a href="#solutions" style={{ fontWeight: 600, color: '#4B5563', fontSize: '0.95rem' }}>Solutions</a>
          </div>
        )}

        {/* Action Buttons / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <>
              {currentUser?.role === 'ADMIN' ? (
                <Link to="/admin-dashboard" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Shield size={16} /> Admin Portal
                </Link>
              ) : (
                <Link to="/employee-dashboard" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <LayoutDashboard size={16} /> Employee Portal
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid #E5E7EB' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#E9F1FA',
                  color: '#00ABE4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  <UserIcon size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937', lineHeight: '1.2' }}>
                    {currentUser?.name}
                  </span>
                  <span className={`badge ${currentUser?.role === 'ADMIN' ? 'badge-admin' : 'badge-employee'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', marginTop: '2px' }}>
                    {currentUser?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', marginLeft: '6px' }}
                  title="Logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '9px 18px' }}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '9px 20px' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

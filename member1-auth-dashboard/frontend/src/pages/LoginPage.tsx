import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({
        email,
        password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);

        // Redirect based on user role
        if (res.user.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-Fill helpers
  const fillDemoAdmin = () => {
    setEmail('admin@dayflow.com');
    setPassword('Admin@123');
    setError(null);
  };

  const fillDemoEmployee = () => {
    setEmail('employee@dayflow.com');
    setPassword('Employee@123');
    setError(null);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E9F1FA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 16px'
      }}>
        <div className="card" style={{
          maxWidth: '440px',
          width: '100%',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -10px rgba(0, 171, 228, 0.12)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: '#E9F1FA',
              color: '#00ABE4',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <LogIn size={26} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '6px' }}>
              Sign in to access your Dayflow HR portal
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9CA3AF' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9CA3AF' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ padding: '14px', marginTop: '10px', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (
                <>
                  Log In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Box */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: '#E9F1FA',
            border: '1px dashed #00ABE4'
          }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2937', marginBottom: '10px', textAlign: 'center' }}>
              ⚡ Quick Demo Credentials Auto-Fill
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="btn btn-secondary"
                style={{ padding: '8px', fontSize: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1' }}
              >
                <ShieldCheck size={14} color="#6D28D9" /> Fill Admin
              </button>
              <button
                type="button"
                onClick={fillDemoEmployee}
                className="btn btn-secondary"
                style={{ padding: '8px', fontSize: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1' }}
              >
                <UserCheck size={14} color="#00ABE4" /> Fill Employee
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E7EB', fontSize: '0.9rem', color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 700, color: '#00ABE4' }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

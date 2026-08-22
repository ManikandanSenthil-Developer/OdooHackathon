import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { UserPlus, Mail, Lock, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.signup({
        name,
        email,
        password,
        role,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        setError(res.message || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'An error occurred during signup.';
      setError(msg);
    } finally {
      setLoading(false);
    }
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
          maxWidth: '460px',
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
              <UserPlus size={26} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Your Account</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '6px' }}>
              Join Dayflow HRMS to streamline your workplace workflow
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9CA3AF' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="form-group">
              <label className="form-label">System Role</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9CA3AF', zIndex: 1 }} />
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'ADMIN')}
                  style={{ paddingLeft: '42px' }}
                >
                  <option value="EMPLOYEE">Employee (Self-Service Portal)</option>
                  <option value="ADMIN">Admin / HR Officer (Full Access)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ padding: '14px', marginTop: '10px', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E7EB', fontSize: '0.9rem', color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#00ABE4' }}>
              Log In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

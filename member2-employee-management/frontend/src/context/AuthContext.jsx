import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_AUTH_USERS = {
  employee: {
    userId: 'usr_emp_1001',
    employeeId: 'EMP-1001',
    role: 'EMPLOYEE',
    name: 'John Doe',
    email: 'john.doe@dayflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  admin: {
    userId: 'usr_adm_9999',
    employeeId: 'EMP-1003',
    role: 'ADMIN',
    name: 'Michael Chen (Admin)',
    email: 'michael.chen@dayflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  }
};

export function AuthProvider({ children, initialAuth = null }) {
  // Read auth provided by Member 1 (props or session state)
  const [currentUser, setCurrentUser] = useState(() => {
    if (initialAuth) return initialAuth;
    try {
      const saved = localStorage.getItem('dayflow_auth_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Auth session storage error:', e);
    }
    return DEFAULT_AUTH_USERS.employee;
  });

  const switchRole = (roleType) => {
    const newUser = DEFAULT_AUTH_USERS[roleType] || DEFAULT_AUTH_USERS.employee;
    setCurrentUser(newUser);
    localStorage.setItem('dayflow_auth_session', JSON.stringify(newUser));
  };

  const updateAvatarInAuth = (newAvatarUrl) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, avatarUrl: newAvatarUrl };
      localStorage.setItem('dayflow_auth_session', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user: currentUser,
    isAdmin: currentUser?.role === 'ADMIN',
    employeeId: currentUser?.employeeId || 'EMP-1001',
    switchRole,
    updateAvatarInAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

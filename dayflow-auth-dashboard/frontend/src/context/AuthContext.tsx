import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/authService';

export interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('dayflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('dayflow_token') || null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Validate stored token on mount
  const checkAuth = async () => {
    const storedToken = localStorage.getItem('dayflow_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('dayflow_user', JSON.stringify(res.user));
      }
    } catch (error) {
      console.warn('Invalid token session, logging out...');
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (newToken: string, user: User) => {
    setToken(newToken);
    setCurrentUser(user);
    localStorage.setItem('dayflow_token', newToken);
    localStorage.setItem('dayflow_user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  };

  const isAuthenticated = Boolean(token && currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

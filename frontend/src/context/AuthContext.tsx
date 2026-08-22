import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';

export interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('dayflow_token');
      const storedUser = localStorage.getItem('dayflow_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse auth from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setCurrentUser(newUser);
    localStorage.setItem('dayflow_token', newToken);
    localStorage.setItem('dayflow_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  };

  const updateUser = (partial: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...partial };
    setCurrentUser(updated);
    localStorage.setItem('dayflow_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: Boolean(token && currentUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

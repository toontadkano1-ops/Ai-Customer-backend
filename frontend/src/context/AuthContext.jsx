import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('cx_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success) {
          setUser(res.user);
          setBusiness(res.business);
        } else {
          localStorage.removeItem('cx_token');
        }
      } catch (err) {
        console.error('Failed to restore session:', err.message);
        localStorage.removeItem('cx_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      localStorage.setItem('cx_token', res.token);
      setUser(res.user);
      // Fetch full business details
      try {
        const meRes = await authService.getMe();
        if (meRes.business) setBusiness(meRes.business);
      } catch (e) {
        // ignore
      }
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success) {
      localStorage.setItem('cx_token', res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('cx_token');
    setUser(null);
    setBusiness(null);
  };

  // Convenient 1-click role switcher for testing and demonstration
  const switchDemoRole = async (targetRole) => {
    const credentials = {
      admin: { email: 'admin@apex.io', password: 'Password123!' },
      agent: { email: 'agent@apex.io', password: 'Password123!' },
      customer: { email: 'customer@acme.com', password: 'Password123!' }
    };

    const creds = credentials[targetRole];
    if (creds) {
      setLoading(true);
      try {
        await login(creds.email, creds.password);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAgent: user?.role === 'agent',
        isCustomer: user?.role === 'customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

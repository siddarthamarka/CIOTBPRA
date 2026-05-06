import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
        return { success: true };
      }
      setError(res.data.error || 'Invalid credentials');
      return { success: false };
    } catch (e) {
      setError('Server unreachable. Check backend.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, age, gender, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(name, age, gender, email, password);
      if (res.data.message === 'registered') return { success: true };
      setError(res.data.message || 'Registration failed');
      return { success: false };
    } catch {
      setError('Server unreachable.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, register, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { useState, useEffect, useCallback } from 'react';
import * as api from './api';

export function useAuth() {
  const [user, setUser] = useState<api.AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      if (!api.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        // Token invalid or expired
        api.logout();
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      return data.user;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    }
  }, []);

  const handleRegister = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const data = await api.register(name, email, password);
      setUser(data.user);
      return data.user;
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
      throw err;
    }
  }, []);

  const handleLogout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: () => setError(null),
  };
}

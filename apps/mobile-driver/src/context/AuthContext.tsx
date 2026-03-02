import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { tokenStorage } from '../services/api';
import { authService } from '../services/auth.service';

export interface DriverUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthState {
  user: DriverUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const checkAuth = useCallback(async () => {
    const token = await tokenStorage.getAccess();
    if (!token) {
      setState((s) => ({ ...s, isLoggedIn: false, user: null, isLoading: false }));
      return;
    }
    try {
      const profile = await authService.getProfile();
      const user = profile?.user ?? profile;
      setState((s) => ({
        ...s,
        isLoggedIn: true,
        user: user ? { id: user.id, email: user.email, ...user } : null,
        isLoading: false,
      }));
    } catch {
      await tokenStorage.clear();
      setState((s) => ({ ...s, isLoggedIn: false, user: null, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, error: null, isLoading: true }));
    try {
      const data = await authService.login(email, password);
      const user = data?.user ?? data;
      setState({
        user: user ? { id: user.id, email: user.email ?? email, ...user } : { id: '', email },
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Đăng nhập thất bại';
      setState((s) => ({ ...s, isLoading: false, error: message }));
      throw e;
    }
  }, []);

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    }) => {
      setState((s) => ({ ...s, error: null, isLoading: true }));
      try {
        const data = await authService.register(payload);
        const user = data?.user ?? data;
        setState({
          user: user ? { id: user.id, email: user.email ?? payload.email, ...user } : { id: '', email: payload.email },
          isLoggedIn: true,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Đăng ký thất bại';
        setState((s) => ({ ...s, isLoading: false, error: message }));
        throw e;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    setState({ user: null, isLoggedIn: false, isLoading: false, error: null });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isLoggedIn) return;
    try {
      const profile = await authService.getProfile();
      const user = profile?.user ?? profile;
      setState((s) => ({ ...s, user: user ? { id: user.id, email: user.email, ...user } : s.user }));
    } catch {
      // keep current user
    }
  }, [state.isLoggedIn]);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

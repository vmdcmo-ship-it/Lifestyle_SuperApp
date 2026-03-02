import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, tokenStorage } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          const profile = await api.get<User>('/auth/profile');
          setUser(profile);
        }
      } catch {
        await tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/login', { email, password });
    const { tokens, user } = data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    }
    setUser(user);
  }, []);

  const register = useCallback(async (payload: { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string }) => {
    const data = await api.post<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/register', payload);
    const { tokens, user } = data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    }
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    await tokenStorage.clearTokens();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.get<User>('/auth/profile');
      setUser(profile);
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

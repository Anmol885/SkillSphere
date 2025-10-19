'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, AuthResponse } from '@/lib/api/auth';
import { User, userApi } from '@/lib/api/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await userApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing token on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        fetchUser();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await authApi.login({ email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    setToken(response.token);
    setUser(response.user as unknown as User);
  };

  const register = async (name: string, email: string, password: string) => {
    const response: AuthResponse = await authApi.register({ name, email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    setToken(response.token);
    setUser(response.user as unknown as User);
  };

  const logout = () => {
    authApi.logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

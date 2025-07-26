'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  badges: string[];
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    }
  }, []);

  const fetchProfile = async (jwt: string) => {
    try {
      const res = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setUser(res.data.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

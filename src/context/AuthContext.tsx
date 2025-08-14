'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import api from '@/utils/api';

interface Goal {
  title: string;
  target: number;
  progress?: number;
  deadline?: string;
  reminder?: string;
  completed: boolean;
}

interface LocalUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  theme?: 'light' | 'dark';
  xp: number;
  level: number;
  streak?: number;
  badges: string[];
  goals?: Goal[];
  provider?: 'google' | 'local';
  password?: string;
  role?: 'user' | 'admin' | 'moderator';
}

interface AuthContextProps {
  user: LocalUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<LocalUser>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selfAssessmentCompleted');
    delete api.defaults.headers.common['Authorization'];
  };

  const fetchProfile = useCallback(async (jwt: string) => {
    try {
      const res = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const storedUser = localStorage.getItem('user');
      const provider = storedUser ? JSON.parse(storedUser).provider : undefined;

      const fullUser = {
        ...res.data.data,
        provider: res.data.data.provider || provider || 'local',
      };

      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    } catch (err) {
      console.error('❌ Failed to fetch profile:', err);

      // Evita logout si venimos de un intento fallido de login
      if (!window.location.pathname.includes('/login')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    await fetchProfile(token);
  }, [fetchProfile, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const loginErrorFlag = sessionStorage.getItem('login-error');

    if (loginErrorFlag) {
      sessionStorage.removeItem('login-error');
      setLoading(false);
      return;
    }

    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password });
  };

  const updateUser = (updates: Partial<LocalUser>) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...updates } : prev;
      if (updated) localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
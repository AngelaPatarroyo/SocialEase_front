'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '@/utils/api';
import type { AdminUser, UserFeedback, AdminScenario, AdminStats } from '@/types/admin';

interface AdminContextProps {
  // User Management
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: AdminUser['role']) => Promise<void>;
  updateUserStatus: (userId: string, status: AdminUser['status']) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createUser: (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => Promise<AdminUser>;
  
  // Feedback Management
  feedback: UserFeedback[];
  fetchFeedback: () => Promise<void>;
  deleteFeedback: (feedbackId: string) => Promise<void>;
  
  // Scenario Management
  scenarios: AdminScenario[];
  fetchScenarios: () => Promise<void>;
  updateScenarioStatus: (scenarioId: string, status: AdminScenario['status']) => Promise<void>;
  
  // Dashboard
  stats: AdminStats | null;
  fetchStats: () => Promise<void>;
  
  // Utility
  clearError: () => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [scenarios, setScenarios] = useState<AdminScenario[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // User Management
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/users');
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: AdminUser['role']) => {
    try {
      setError(null);
      await api.patch(`/api/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
      throw err;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: AdminUser['status']) => {
    try {
      setError(null);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setError(null);
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<AdminUser, '_id' | 'createdAt' | 'lastLogin'>) => {
    try {
      setError(null);
      const response = await api.post('/api/admin/users', userData);
      const newUser = response.data;
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
      throw err;
    }
  }, []);

  // Feedback Management
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/feedback');
      setFeedback(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFeedback = useCallback(async (feedbackId: string) => {
    try {
      setError(null);
      await api.delete(`/api/admin/feedback/${feedbackId}`);
      setFeedback(prev => prev.filter(item => item._id !== feedbackId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete feedback');
      throw err;
    }
  }, []);

  // Scenario Management
  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/scenarios');
      if (response.data && Array.isArray(response.data)) {
        const adminScenarios = response.data.map((scenario: any) => ({
          id: scenario.id || scenario._id || Math.random().toString(),
          title: scenario.title || scenario.name || 'Unknown',
          description: scenario.description || 'No description',
          level: scenario.level || 'beginner',
          category: scenario.category || 'general',
          status: 'active' as AdminScenario['status'],
          xpReward: scenario.xp || 10,
          isVR: scenario.isVR || false,
          createdAt: scenario.createdAt || new Date().toISOString(),
          updatedAt: scenario.updatedAt || new Date().toISOString(),
          completionRate: 0,
          averageRating: 0,
          totalCompletions: 0,
        }));
        setScenarios(adminScenarios);
      } else {
        setScenarios([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch scenarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScenarioStatus = useCallback(async (scenarioId: string, status: AdminScenario['status']) => {
    try {
      setError(null);
      setScenarios(prev => prev.map(scenario => 
        scenario.id === scenarioId ? { ...scenario, status } : scenario
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update scenario status');
      throw err;
    }
  }, []);

  // Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const mockStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        suspendedUsers: users.filter(u => u.status === 'suspended').length,
        totalScenarios: scenarios.length,
        activeScenarios: scenarios.filter(s => s.status === 'active').length,
        totalFeedback: feedback.length,
        openFeedback: feedback.length,
        systemHealth: 'healthy' as const,
        lastBackup: new Date().toISOString(),
      };
      setStats(mockStats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [users, scenarios, feedback]);

  return (
    <AdminContext.Provider value={{
      // User Management
      users,
      loading,
      error,
      fetchUsers,
      updateUserRole,
      updateUserStatus,
      deleteUser,
      createUser,
      
      // Feedback Management
      feedback,
      fetchFeedback,
      deleteFeedback,
      
      // Scenario Management
      scenarios,
      fetchScenarios,
      updateScenarioStatus,
      
      // Dashboard
      stats,
      fetchStats,
      
      // Utility
      clearError,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

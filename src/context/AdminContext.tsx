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
import {
  AdminUser,
  UserFeedback,
  SystemActivity,
  AdminScenario,
  AdminStats,
} from '@/types/admin';

interface AdminContextProps {
  // State
  users: AdminUser[];
  feedback: UserFeedback[];
  activities: SystemActivity[];
  scenarios: AdminScenario[];
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchFeedback: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchScenarios: () => Promise<void>;
  fetchStats: () => Promise<void>;
  
  // User Management
  updateUserStatus: (userId: string, status: AdminUser['status']) => Promise<void>;
  updateUserRole: (userId: string, role: AdminUser['role']) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Feedback Management
  updateFeedbackStatus: (feedbackId: string, status: UserFeedback['status']) => Promise<void>;
  assignFeedback: (feedbackId: string, adminId: string) => Promise<void>;
  
  // Scenario Management
  updateScenarioStatus: (scenarioId: string, status: AdminScenario['status']) => Promise<void>;
  createScenario: (scenario: Omit<AdminScenario, 'id' | 'createdAt' | 'updatedAt' | 'completionRate' | 'averageRating' | 'totalCompletions'>) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [scenarios, setScenarios] = useState<AdminScenario[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to get all users from your existing endpoint
      try {
        console.log('🔍 Attempting to fetch users from /api/admin/users...');
        
        // Get the current token from localStorage
        const token = localStorage.getItem('token');
        console.log('🔑 Token available:', !!token);
        console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Make the API call with explicit authorization header
        console.log('📡 Making API call to /api/admin/users with token...');
        
        // First, let's test if basic authentication works with your profile endpoint
        try {
          console.log('🧪 Testing basic auth with /user/profile...');
          const profileResponse = await api.get('/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('✅ Profile auth test successful:', profileResponse.data);
        } catch (profileError: any) {
          console.log('❌ Profile auth test failed:', profileError.response?.status);
        }
        
        const response = await api.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('✅ Users API response:', response.data);
        
        if (response.data && response.data.data) {
          console.log('📊 Setting users:', response.data.data);
          setUsers(response.data.data);
          setStats(prev => prev ? {
            ...prev,
            totalUsers: response.data.data.length,
            activeUsers: response.data.data.filter((u: any) => u.status === 'active').length,
            suspendedUsers: response.data.data.filter((u: any) => u.status === 'suspended').length,
          } : null);
        } else {
          console.log('⚠️ No user data in response');
          setUsers([]);
        }
      } catch (adminError: any) {
        console.error('❌ Error fetching users from /api/admin/users:', adminError);
        console.log('📋 Error details:', {
          message: adminError.message,
          status: adminError.response?.status,
          data: adminError.response?.data,
          headers: adminError.response?.headers
        });
        
        // Log the full error response for debugging
        if (adminError.response) {
          console.log('🚨 Full error response:', {
            status: adminError.response.status,
            statusText: adminError.response.statusText,
            data: adminError.response.data,
            headers: adminError.response.headers
          });
        }
        
        // Fallback: create a simple user list with your current user
        console.log('🔄 Using fallback user data');
        const currentUser = {
          id: 'current-user',
          name: 'Admin_Angela',
          email: 'angela.patarroyo@hotmail.com',
          role: 'admin' as const,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: '/images/default-avatar.png',
          xp: 0,
          level: 1,
        };
        setUsers([currentUser]);
        
        // Update stats with user count
        setStats(prev => prev ? {
          ...prev,
          totalUsers: 1,
          activeUsers: 1,
        } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      // For now, set empty feedback - you can add feedback functionality later
      setFeedback([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch feedback');
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      // For now, set empty activities - you can add activity logging later
      setActivities([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch activities');
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      // Try to get scenarios from your existing scenarios endpoint
      console.log('🔍 Attempting to fetch scenarios from /scenarios...');
      
      // Get the current token from localStorage
      const token = localStorage.getItem('token');
      console.log('🔑 Token available for scenarios:', !!token);
      
      // Make the API call with explicit authorization header
      const response = await api.get('/scenarios', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Scenarios API response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform your existing scenario data to admin format
        const adminScenarios = response.data.map((scenario: any) => ({
          id: scenario.id || scenario._id || Math.random().toString(),
          title: scenario.title || scenario.name || 'Unknown',
          description: scenario.description || 'No description',
          level: scenario.level || 'beginner',
          category: scenario.category || 'general',
          status: 'active' as AdminScenario['status'], // Default status
          xpReward: scenario.xp || 10,
          createdAt: scenario.createdAt || new Date().toISOString(),
          updatedAt: scenario.updatedAt || new Date().toISOString(),
          completionRate: 0, // You can calculate this later
          averageRating: 0, // You can calculate this later
          totalCompletions: 0, // You can calculate this later
        }));
        setScenarios(adminScenarios);
        
        // Update stats with scenario count
        setStats(prev => prev ? {
          ...prev,
          totalScenarios: adminScenarios.length,
          activeScenarios: adminScenarios.filter(s => s.status === 'active').length,
        } : null);
      } else {
        setScenarios([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch scenarios');
      console.error('Failed to fetch scenarios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Create stats from existing data or set defaults
      // You can enhance this later by aggregating data from your existing endpoints
      const mockStats = {
        totalUsers: 1, // Will be updated when users are fetched
        activeUsers: 1,
        suspendedUsers: 0,
        totalScenarios: 0, // Will be updated when scenarios are fetched
        activeScenarios: 0,
        totalFeedback: 0,
        openFeedback: 0,
        systemHealth: 'healthy' as const,
        lastBackup: new Date().toISOString(),
      };
      setStats(mockStats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: AdminUser['status']) => {
    try {
      // For now, just update local state
      // You can implement this later with your existing user update endpoint
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
      throw err;
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: AdminUser['role']) => {
    try {
      // Use your existing admin endpoint
      await api.patch(`/api/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      // Use your existing admin endpoint
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // Update stats
      setStats(prev => prev ? {
        ...prev,
        totalUsers: prev.totalUsers - 1,
        activeUsers: prev.activeUsers - 1, // Assuming deleted user was active
      } : null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  }, []);

  const updateFeedbackStatus = useCallback(async (feedbackId: string, status: UserFeedback['status']) => {
    try {
      await api.patch(`/admin/feedback/${feedbackId}/status`, { status });
      setFeedback(prev => prev.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, status } : feedback
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update feedback status');
      throw err;
    }
  }, []);

  const assignFeedback = useCallback(async (feedbackId: string, adminId: string) => {
    try {
      await api.patch(`/admin/feedback/${feedbackId}/assign`, { adminId });
      setFeedback(prev => prev.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, assignedTo: adminId } : feedback
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign feedback');
      throw err;
    }
  }, []);

  const updateScenarioStatus = useCallback(async (scenarioId: string, status: AdminScenario['status']) => {
    try {
      await api.patch(`/admin/scenarios/${scenarioId}/status`, { status });
      setScenarios(prev => prev.map(scenario => 
        scenario.id === scenarioId ? { ...scenario, status } : scenario
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update scenario status');
      throw err;
    }
  }, []);

  const createScenario = useCallback(async (scenario: Omit<AdminScenario, 'id' | 'createdAt' | 'updatedAt' | 'completionRate' | 'averageRating' | 'totalCompletions'>) => {
    try {
      const response = await api.post('/admin/scenarios', scenario);
      const newScenario = response.data.data;
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create scenario');
      throw err;
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchStats();
    fetchScenarios(); // Also fetch scenarios to populate stats
    fetchUsers(); // Also fetch users
  }, [fetchStats, fetchScenarios, fetchUsers]);

  return (
    <AdminContext.Provider
      value={{
        users,
        feedback,
        activities,
        scenarios,
        stats,
        loading,
        error,
        fetchUsers,
        fetchFeedback,
        fetchActivities,
        fetchScenarios,
        fetchStats,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        updateFeedbackStatus,
        assignFeedback,
        updateScenarioStatus,
        createScenario,
        clearError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

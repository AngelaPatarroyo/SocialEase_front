'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserFeedback } from '@/types/admin';
import AdminNav from '@/components/navigation/AdminNav';
import { showNotification } from '@/components/common/Notification';

export default function AdminFeedback() {
  const { user, token, loading: authLoading } = useAuth();
  
  // Extended feedback interface for admin use
  interface ExtendedUserFeedback extends UserFeedback {
    status?: 'open' | 'in-progress' | 'resolved' | 'closed';
    assignedTo?: string | null;
    scenarioName?: string;
    userName?: string;
  }
  
  // Scenario completion feedback data
  const [feedback, setFeedback] = useState<ExtendedUserFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      if (!user || user.role !== 'admin') {
        setError('Access denied. Admin role required.');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching scenario feedback...');
      
      console.log('🔍 Backend endpoint is ready - fetching real feedback data...');
      
      const response = await fetch('/api/admin/feedback', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        
        if (response.status === 401) {
          setError('Unauthorized. Please refresh your session.');
        } else {
          setError(`Failed to fetch feedback: ${response.status} - ${errorText}`);
        }
        return;
      }

      const feedbackData = await response.json();
      console.log('📊 Received real feedback data:', feedbackData);
      
      // Check if feedbackData is an array
      if (!Array.isArray(feedbackData)) {
        console.error('❌ Backend did not return an array:', feedbackData);
        if (feedbackData.error) {
          throw new Error(`Backend error: ${feedbackData.error}`);
        } else {
          throw new Error('Backend returned invalid data format');
        }
      }
      

      
      // Transform the data to include scenario names and user names
      const transformedFeedback = feedbackData.map((item: any) => ({
        ...item,
        scenarioName: String(item.scenarioId?.title || item.scenarioId?.name || item.scenarioName || 'Unknown Scenario'),
        userName: String(item.userId?.name || item.userId?.firstName || item.userName || `User ${item.userId}`),
        reflection: String(item.reflection || ''),
        priority: getPriorityFromRating(item.rating || 0)
      }));
      
      setFeedback(transformedFeedback);
      setError(null); // Clear any previous errors
      
    } catch (error) {
      console.error('Error fetching feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load feedback';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, token]);
  

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [deleteConfirmation, setDeleteConfirmation] = useState<{id: string, name: string} | null>(null);
  
  const handleDeleteFeedback = async (feedbackId: string) => {
    // Find the feedback item to get the scenario name
    const feedbackItem = feedback.find(item => item._id === feedbackId);
    if (feedbackItem) {
      setDeleteConfirmation({ id: feedbackId, name: feedbackItem.scenarioName || 'Unknown Scenario' });
    }
  };
  
  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    
    try {
      const response = await fetch(`/api/admin/feedback/${deleteConfirmation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend delete response:', response.status, errorText);
        throw new Error(`Backend responded with status: ${response.status}: ${errorText}`);
      }
      
      // Remove the deleted feedback from the local state
      setFeedback(prev => prev.filter(item => item._id !== deleteConfirmation.id));
      
      // Show success notification
      showNotification('success', 'Feedback Removed', 'The user feedback has been safely removed from the system');
      
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showNotification('error', 'Unable to Remove', 'We couldn\'t remove the feedback at this time. Please try again.');
    } finally {
      setDeleteConfirmation(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchFeedback();
    }
  }, [user, fetchFeedback]);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = (item.scenarioName?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.reflection?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.userName?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });



  const getPriorityFromRating = (rating: number): UserFeedback['priority'] => {
    if (rating <= 1) return 'critical';
    if (rating <= 2) return 'high';
    if (rating <= 3) return 'medium';
    if (rating <= 4) return 'low';
    return 'low';
  };

  const getPriorityColor = (priority: UserFeedback['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  const getComfortLevelIcon = (rating: number) => {
    if (rating <= 1) return '😰'; // Very uncomfortable
    if (rating <= 2) return '😟'; // Uncomfortable  
    if (rating <= 3) return '😐'; // Neutral
    if (rating <= 4) return '🙂'; // Comfortable
    return '😊'; // Very comfortable
  };

  const getComfortLevelText = (rating: number) => {
    if (rating <= 1) return 'Very Uncomfortable';
    if (rating <= 2) return 'Uncomfortable';
    if (rating <= 3) return 'Neutral';
    if (rating <= 4) return 'Comfortable';
    return 'Very Comfortable';
  };

  const getComfortLevelColor = (rating: number) => {
    if (rating <= 1) return 'bg-red-100 text-red-700 border-red-200';
    if (rating <= 2) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (rating <= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (rating <= 4) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Scenario Feedback</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Review how users felt after completing social scenarios</p>
      
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors">
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <AdminNav />

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Feedback
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by scenario name, reflection, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              User Feedback ({filteredFeedback.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredFeedback.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header with scenario name and comfort level */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {item.scenarioName}
                        </h4>
                        
                        {/* Comfort Level Indicator */}
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{getComfortLevelIcon(item.rating)}</span>
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getComfortLevelColor(item.rating)}`}>
                              {getComfortLevelText(item.rating)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Comfort Level: {item.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Priority Badge */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority || 'medium')}`}>
                          {item.priority} Priority
                        </span>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => router.push(`/admin/feedback/${item._id}`)}
                            className="text-sm text-indigo-600 hover:text-indigo-900 px-3 py-1.5 border border-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          >
                            View Details
                          </button>
                          
                          <button
                            onClick={() => handleDeleteFeedback(item._id)}
                            className="text-sm text-red-600 hover:text-red-900 px-3 py-1.5 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Reflection */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        User Reflection
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border-l-4 border-indigo-400">
                        <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                          "{item.reflection}"
                        </p>
                      </div>
                    </div>
                    
                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-600">
                      <span>By: <span className="font-medium text-gray-700 dark:text-gray-300">{item.userName}</span></span>
                      <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredFeedback.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No feedback found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Remove Feedback
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to remove the feedback for <span className="font-semibold text-gray-900 dark:text-white">"{deleteConfirmation.name}"</span>? 
                <br />
                <span className="text-red-600 dark:text-red-400">This action cannot be undone.</span>
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove Feedback
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

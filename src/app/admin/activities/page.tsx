'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SystemActivity } from '@/types/admin';
import AdminNav from '@/components/navigation/AdminNav';

export default function AdminActivities() {
  const { user, loading: authLoading } = useAuth();
  // Mock admin data for now - replace with real data later
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      // Hardcoded activities data that matches your backend structure
      const hardcodedActivities: SystemActivity[] = [
        {
          type: 'feedback',
          action: 'submitted feedback',
          user: {
            _id: '68975d4c6a2018b257fb1b93',
            name: 'Daniela Perez',
            email: 'daniela941223@gmail.com'
          },
          scenario: {
            _id: '6894f01341ddfbf9ac381bb1',
            title: 'Greet a Stranger'
          },
          rating: 5,
          timestamp: '2025-08-19T00:15:00.000Z',
          details: 'The noise made me super anxious but it felt good to have a nice interaction with someone I don\'t know'
        },
        {
          type: 'user',
          action: 'registered',
          user: {
            _id: '689a471e48dd1c3a239ed7d6',
            name: 'Daniela Converttida',
            email: 'danielaco198682patas@gmail.com'
          },
          timestamp: '2025-08-11T19:40:14.240Z',
          details: 'Provider: local'
        },
        {
          type: 'progress',
          action: 'completed scenario',
          user: {
            _id: '68975d4c6a2018b257fb1b93',
            name: 'Daniela Perez',
            email: 'daniela941223@gmail.com'
          },
          scenario: {
            _id: '6894f01341ddfbf9ac381bb1',
            title: 'Greet a Stranger'
          },
          timestamp: '2025-08-19T00:10:00.000Z',
          details: 'Score: 85 - Successfully completed the scenario'
        },
        {
          type: 'feedback',
          action: 'submitted feedback',
          user: {
            _id: '68975d4c6a2018b257fb1b93',
            name: 'Daniela Perez',
            email: 'daniela941223@gmail.com'
          },
          scenario: {
            _id: '6894f01341ddfbf9ac381bb1',
            title: 'Greet a Stranger'
          },
          rating: 4,
          timestamp: '2025-08-18T23:47:10.655Z',
          details: 'I felt much more confident this time! The interaction went smoothly.'
        },
        {
          type: 'user',
          action: 'updated profile',
          user: {
            _id: '689a448848dd1c3a239ed72b',
            name: 'Angela Patarroyo',
            email: 'angela.patarroyo3456@hotmail.com'
          },
          timestamp: '2025-08-14T22:52:40.227Z',
          details: 'Updated avatar and completed self-assessment'
        },
        {
          type: 'progress',
          action: 'completed scenario',
          user: {
            _id: '68975d4c6a2018b257fb1b93',
            name: 'Daniela Perez',
            email: 'daniela941223@gmail.com'
          },
          scenario: {
            _id: '6894f01341ddfbf9ac381bb1',
            title: 'Greet a Stranger'
          },
          timestamp: '2025-08-18T23:30:00.000Z',
          details: 'Score: 92 - Excellent performance'
        },
        {
          type: 'assessment',
          action: 'completed self-assessment',
          user: {
            _id: '68975d4c6a2018b257fb1b93',
            name: 'Daniela Perez',
            email: 'daniela941223@gmail.com'
          },
          timestamp: '2025-08-10T21:18:38.169Z',
          details: 'Social anxiety level: Moderate (3/5) - Goals set for improvement'
        },
        {
          type: 'user',
          action: 'deleted account',
          user: {
            _id: '688bceb47085a9fe759ff569',
            name: 'User Account',
            email: 'deleted@example.com'
          },
          timestamp: '2025-08-19T00:15:55.000Z',
          details: 'Account permanently removed from system'
        },
        {
          type: 'feedback',
          action: 'submitted feedback',
          user: {
            _id: '6894ef1b330b77af3eb7735a',
            name: 'Angela Patarroyo',
            email: 'angela.patarroyo1986@hotmail.com'
          },
          scenario: {
            _id: '6894f01341ddfbf9ac381bb1',
            title: 'Greet a Stranger'
          },
          rating: 3,
          timestamp: '2025-08-11T20:55:03.488Z',
          details: 'Found it challenging but managed to complete successfully'
        },
        {
          type: 'progress',
          action: 'earned badge',
          user: {
            _id: '68975d4c6a2018b257fb1b93',
            name: 'Daniela Perez',
            email: 'daniela941223@gmail.com'
          },
          timestamp: '2025-08-19T00:07:21.561Z',
          details: 'Earned "Halfway Hero" badge for consistent practice'
        }
      ];
      
      setActivities(hardcodedActivities);
      setLoading(false);
    }, 800);
  }, []);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<SystemActivity['type'] | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<'1h' | '24h' | '7d' | '30d' | 'all'>('24h');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, fetchActivities]);

  const getFilteredActivities = () => {
    let filtered = activities.filter(activity => {
      const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (activity.scenario?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || activity.type === typeFilter;
      
      return matchesSearch && matchesType;
    });

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const timeMap = {
        '1h': new Date(now.getTime() - 60 * 60 * 1000),
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
      
      filtered = filtered.filter(activity => 
        new Date(activity.timestamp) >= timeMap[timeFilter]
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const filteredActivities = getFilteredActivities();
  


  const getActivityIcon = (type: SystemActivity['type']) => {
    switch (type) {
      case 'feedback': return (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
      case 'user': return (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
      case 'progress': return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
      case 'assessment': return (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
      default: return (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: SystemActivity['type']) => {
    switch (type) {
      case 'feedback': return 'bg-pink-100 text-pink-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'progress': return 'bg-green-100 text-green-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityStats = () => {
    const stats = {
      total: filteredActivities.length,
      feedback: filteredActivities.filter(a => a.type === 'feedback').length,
      users: filteredActivities.filter(a => a.type === 'user').length,
      progress: filteredActivities.filter(a => a.type === 'progress').length,
    };
    return stats;
  };

  const activityStats = getActivityStats();

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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Activity Monitor</h1>
              <p className="text-gray-600">Monitor system and user activities in real-time</p>
              <p className="text-blue-600 text-sm mt-1">📊 Using sample data - Shows how activities will look with real backend</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchActivities}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
              <Link href="/admin" className="text-indigo-800">
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <AdminNav />



      {/* Activity Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Activities</dt>
                    <dd className="text-lg font-medium text-gray-900">{activityStats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Errors</dt>
                    <dd className="text-lg font-medium text-red-600">{activityStats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Warnings</dt>
                    <dd className="text-lg font-medium text-yellow-600">{activityStats.feedback}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Info</dt>
                    <dd className="text-lg font-medium text-blue-600">{activityStats.users}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Activities
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by details, user, or scenario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as SystemActivity['type'] | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="feedback">Feedback</option>
                <option value="user">User</option>
                <option value="progress">Progress</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>
            

            
            <div>
              <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                id="time-filter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as '1h' | '24h' | '7d' | '30d' | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Activities ({filteredActivities.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{activity.action}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                        {activity.rating && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Rating: {activity.rating}/5
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-600 mb-2"><strong>Details:</strong></p>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md italic">"{activity.details}"</p>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>User: <span className="font-medium">{activity.user.name}</span></span>
                        {activity.scenario && (
                          <span>Scenario: <span className="font-medium">{activity.scenario.title}</span></span>
                        )}
                        <span>Time: {formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredActivities.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || typeFilter !== 'all' || timeFilter !== 'all' 
                      ? 'No activities match your current filters. Try adjusting your search criteria.'
                      : 'No system activities have been recorded yet. Activities will appear here as users interact with the system.'
                    }
                  </p>
                  {(searchTerm || typeFilter !== 'all' || timeFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setTypeFilter('all');
                        setTimeFilter('all');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

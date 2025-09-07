'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminScenario } from '@/types/admin';
import AdminNav from '@/components/navigation/AdminNav';

export default function AdminScenarios() {
  const { user, loading: authLoading } = useAuth();
  // Mock admin data for now - replace with real data later
  const [scenarios, setScenarios] = useState<AdminScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Real scenario data from your scenarios page
      const realScenarios: AdminScenario[] = [
        {
          id: '1',
          title: 'Intro to SocialEase',
          description: 'Get started with your social anxiety journey',
          level: 'beginner',
          status: 'active',
          category: 'introduction',
          xpReward: 10,
          completionRate: 95,
          averageRating: 4.6,
          totalCompletions: 245,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '2',
          title: 'Order at a Cafe',
          description: 'Learn to order food and drinks confidently',
          level: 'beginner',
          status: 'active',
          category: 'service',
          xpReward: 20,
          completionRate: 88,
          averageRating: 4.3,
          totalCompletions: 189,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '3',
          title: 'Greet a Stranger',
          description: 'Practice introducing yourself to someone new',
          level: 'beginner',
          status: 'active',
          category: 'social',
          xpReward: 20,
          completionRate: 82,
          averageRating: 4.1,
          totalCompletions: 167,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '4',
          title: 'Say No Politely',
          description: 'Learn to set boundaries respectfully',
          level: 'beginner',
          status: 'active',
          category: 'boundaries',
          xpReward: 25,
          completionRate: 75,
          averageRating: 3.9,
          totalCompletions: 134,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '5',
          title: 'Start Small Talk',
          description: 'Practice casual conversation starters',
          level: 'beginner',
          status: 'active',
          category: 'conversation',
          xpReward: 25,
          completionRate: 79,
          averageRating: 4.0,
          totalCompletions: 156,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '6',
          title: 'Join Group Conversation',
          description: 'Practice participating in group discussions',
          level: 'beginner',
          status: 'active',
          category: 'group',
          xpReward: 30,
          completionRate: 68,
          averageRating: 3.7,
          totalCompletions: 98,
          isVR: true,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '7',
          title: 'Talk to a Co-worker',
          description: 'Build confidence in workplace interactions',
          level: 'intermediate',
          status: 'active',
          category: 'workplace',
          xpReward: 30,
          completionRate: 73,
          averageRating: 4.2,
          totalCompletions: 123,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '8',
          title: 'Give a Compliment',
          description: 'Learn to express genuine appreciation',
          level: 'intermediate',
          status: 'active',
          category: 'social',
          xpReward: 30,
          completionRate: 81,
          averageRating: 4.4,
          totalCompletions: 145,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '9',
          title: 'Ask for Help in Public',
          description: 'Practice seeking assistance confidently',
          level: 'intermediate',
          status: 'active',
          category: 'public',
          xpReward: 30,
          completionRate: 66,
          averageRating: 3.8,
          totalCompletions: 89,
          isVR: true,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '10',
          title: 'Speak Up in a Group',
          description: 'Build confidence in group settings',
          level: 'intermediate',
          status: 'active',
          category: 'group',
          xpReward: 30,
          completionRate: 71,
          averageRating: 3.9,
          totalCompletions: 112,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '11',
          title: 'Make a Phone Call',
          description: 'Practice phone communication skills',
          level: 'advanced',
          status: 'active',
          category: 'communication',
          xpReward: 35,
          completionRate: 62,
          averageRating: 3.6,
          totalCompletions: 78,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '12',
          title: 'Handle Criticism',
          description: 'Learn to receive feedback gracefully',
          level: 'advanced',
          status: 'active',
          category: 'feedback',
          xpReward: 35,
          completionRate: 58,
          averageRating: 3.5,
          totalCompletions: 67,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '13',
          title: 'Disagree Respectfully',
          description: 'Practice expressing different opinions',
          level: 'advanced',
          status: 'active',
          category: 'communication',
          xpReward: 40,
          completionRate: 55,
          averageRating: 3.4,
          totalCompletions: 56,
          isVR: false,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '14',
          title: 'Mock Interview',
          description: 'Practice job interview scenarios',
          level: 'advanced',
          status: 'active',
          category: 'professional',
          xpReward: 45,
          completionRate: 69,
          averageRating: 4.1,
          totalCompletions: 89,
          isVR: true,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        },
        {
          id: '15',
          title: 'Attend a Networking Event',
          description: 'Build professional connections confidently',
          level: 'advanced',
          status: 'active',
          category: 'professional',
          xpReward: 45,
          completionRate: 52,
          averageRating: 3.3,
          totalCompletions: 45,
          isVR: true,
          createdAt: '2025-08-01T00:00:00.000Z',
          updatedAt: '2025-08-01T00:00:00.000Z'
        }
      ];
      
      setScenarios(realScenarios);
      setLoading(false);
    }, 1000);
  }, []);
  
  const updateScenarioStatus = async (scenarioId: string, status: AdminScenario['status']) => {
    setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, status } : s));
  };
  
  const createScenario = async (scenario: any) => {
    const newScenario = { ...scenario, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setScenarios(prev => [...prev, newScenario]);
  };
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminScenario['status'] | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<AdminScenario['level'] | 'all'>('all');
  const [vrFilter, setVrFilter] = useState<'all' | 'vr' | 'non-vr'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newScenario, setNewScenario] = useState({
    title: '',
    description: '',
    level: 'beginner' as AdminScenario['level'],
    category: '',
    xpReward: 10,
    status: 'draft' as AdminScenario['status'],
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchScenarios();
    }
  }, [user, fetchScenarios]);

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || scenario.level === levelFilter;
    const matchesVR = vrFilter === 'all' || 
                     (vrFilter === 'vr' && scenario.isVR) || 
                     (vrFilter === 'non-vr' && !scenario.isVR);
    
    return matchesSearch && matchesStatus && matchesLevel && matchesVR;
  });

  const handleStatusChange = async (scenarioId: string, newStatus: AdminScenario['status']) => {
    try {
      await updateScenarioStatus(scenarioId, newStatus);
    } catch (error) {
      console.error('Failed to update scenario status:', error);
    }
  };

  const handleCreateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createScenario(newScenario);
      setNewScenario({
        title: '',
        description: '',
        level: 'beginner',
        category: '',
        xpReward: 10,
        status: 'draft',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create scenario:', error);
    }
  };

  const getStatusColor = (status: AdminScenario['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: AdminScenario['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scenario Management</h1>
              <p className="text-gray-600">Create and manage learning scenarios</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Scenario
              </button>
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-800">
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <AdminNav />

      {/* Create Scenario Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Scenario</h3>
              <form onSubmit={handleCreateScenario} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={newScenario.title}
                    onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={3}
                    value={newScenario.description}
                    onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      id="level"
                      required
                      value={newScenario.level}
                      onChange={(e) => setNewScenario({ ...newScenario, level: e.target.value as AdminScenario['level'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="xpReward" className="block text-sm font-medium text-gray-700 mb-1">
                      XP Reward
                    </label>
                    <input
                      type="number"
                      id="xpReward"
                      required
                      min="1"
                      max="100"
                      value={newScenario.xpReward}
                      onChange={(e) => setNewScenario({ ...newScenario, xpReward: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    required
                    value={newScenario.category}
                    onChange={(e) => setNewScenario({ ...newScenario, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Scenarios
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AdminScenario['status'] | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Level Filter
              </label>
              <select
                id="level-filter"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as AdminScenario['level'] | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="vr-filter" className="block text-sm font-medium text-gray-700 mb-2">
                VR Filter
              </label>
              <select
                id="vr-filter"
                value={vrFilter}
                onChange={(e) => setVrFilter(e.target.value as "all" | "vr" | "non-vr")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Scenarios</option>
                <option value="vr">VR Only</option>
                <option value="non-vr">Non-VR Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Scenarios ({filteredScenarios.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScenarios.map((scenario) => (
                  <div key={scenario.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{scenario.title}</h4>
                      <div className="flex space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scenario.status)}`}>
                          {scenario.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(scenario.level)}`}>
                          {scenario.level}
                        </span>
                        {scenario.isVR && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            VR 🥽
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{scenario.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-gray-900">{scenario.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">XP Reward:</span>
                        <span className="text-gray-900">{scenario.xpReward}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">VR Enabled:</span>
                        <span className="text-gray-900">{scenario.isVR ? 'Yes 🥽' : 'No'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Completion Rate:</span>
                        <span className="text-gray-900">{scenario.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Completions:</span>
                        <span className="text-gray-900">{scenario.totalCompletions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Average Rating:</span>
                        <span className="text-gray-900">{scenario.averageRating.toFixed(1)}/5</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <select
                        value={scenario.status}
                        onChange={(e) => handleStatusChange(scenario.id, e.target.value as AdminScenario['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                      
                      <button
                        onClick={() => router.push(`/admin/scenarios/${scenario.id}`)}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredScenarios.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No scenarios found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

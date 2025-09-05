'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showNotification } from '@/components/common/Notification';
import api from '@/utils/api';
import SelfAssessmentModal from '@/components/scenarios/SelfAssessment/SelfAssessmentModal';
import { motion } from 'framer-motion';
import {
  LABELS,
  extractList,
  normalize as normalizeSelfAssessment,
  SCENARIOS,
  type SelfAssessmentView,
} from '@/utils/selfAssessment';

export default function SelfAssessmentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sa, setSa] = useState<SelfAssessmentView | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }
        console.log('Making API call to /api/self-assessment...');
        const res = await api.get('/api/self-assessment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API call completed successfully');
        
        const list = extractList(res?.data);
        console.log('Extracted list length:', list.length);
        
        if (list.length > 0) {
          try {
            const normalized = normalizeSelfAssessment(list[0]);
            console.log('Normalized self-assessment:', normalized);
            setSa(normalized);
          } catch (error) {
            console.error('Error normalizing self-assessment:', error);
            setSa(null);
          }
        } else {
          console.log('No self-assessment data found');
          setSa(null);
        }
      } catch (e) {
        console.error('Failed to load self-assessment', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authLoading, user]);

  const addGoal = async (title: string, target = 1, daysFromNow = 7) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const deadline = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      // de-dupe against server
      const existing = await api.get('/api/goals', { headers: { Authorization: `Bearer ${token}` } });
      const exists = (existing.data?.data || [])
        .some((g: any) => String(g.title || '').toLowerCase() === title.toLowerCase());
      if (exists) {
        showNotification('warning', 'Already added', 'This goal is already on your dashboard.');
        return;
      }

      await api.post('/api/goals', { title, target, deadline }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification('success', 'Added!', 'Goal added to your dashboard.');
    } catch {
      showNotification('error', 'Error', 'Could not add this goal.');
    }
  };

  const handleAddAll = async () => {
    if (!sa) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const freq = String(sa.answers.practiceFrequency ?? '').toLowerCase();
    const target = freq === 'daily' ? 1 : (freq === 'monthly' || freq === 'rarely') ? 2 : 3;
    const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const titles: string[] = [];
    const primaryTitle = String(sa.answers.primaryGoal ?? '').trim();
    if (primaryTitle) titles.push(primaryTitle);
    (sa.insights.suggestions || [])
      .filter((s: any) => typeof s === 'string' && s.trim())
      .forEach((s: string) => titles.push(s.trim()));

    // unique within batch
    const uniqueBatch = Array.from(new Set(titles.map(t => t.toLowerCase())))
      .map(lower => titles.find(t => t.toLowerCase() === lower) as string);

    // de-dupe vs server
    const existing = await api.get('/api/goals', { headers: { Authorization: `Bearer ${token}` } });
    const existingTitles = new Set(
      (existing.data?.data || []).map((g: any) => String(g.title || '').toLowerCase())
    );

    const payloads = uniqueBatch
      .filter(t => !existingTitles.has(t.toLowerCase()))
      .map(t => ({ title: t, target, deadline }));

    if (payloads.length === 0) {
      showNotification('info', 'All set', 'These goals are already on your dashboard.');
      return;
    }

    try {
      await Promise.all(payloads.map(p =>
        api.post('/api/goals', p, { headers: { Authorization: `Bearer ${token}` } })
      ));
      showNotification('success', 'Goals added', 'Your goals have been added to the dashboard.');
    } catch (e) {
      console.error(e);
      showNotification('error', 'Error', 'Failed to add goals.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-200">Self-Assessment</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow"
            >
              Update
            </button>
            {sa && (
              <button
                onClick={handleAddAll}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow"
              >
                Add all as goals
              </button>
            )}
            <Link
              href="/dashboard"
              className="py-2 px-4 rounded-lg border border-indigo-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-600"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-500 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors border border-gray-200 dark:border-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
            <Link 
              href="/scenarios" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Scenarios
            </Link>
            <Link 
              href="/goals" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Goals
            </Link>
            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
          </div>
        </div>

        {authLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading authentication...</p>
          </div>
        )}

        {!authLoading && loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your self-assessment...</p>
          </div>
        )}

        {!authLoading && !loading && !sa && (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">📝</div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              No self-assessment completed yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Complete your first self-assessment to get personalized suggestions and goals.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Start Self-Assessment
            </button>
          </div>
        )}

        {!authLoading && !loading && sa && (
          <>
            {/* Assessment Summary */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
                Assessment Summary
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Your Profile</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(sa.answers).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          {LABELS[k as keyof typeof LABELS] ?? k}:
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {Array.isArray(v) ? v.join(', ') : String(v ?? '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleAddAll}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add All Suggestions as Goals
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Next Steps */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
                Suggested Next Steps
              </h2>
              <div className="grid gap-4">
                {sa.insights.suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{s}</span>
                      </div>
                      <button
                        onClick={() => addGoal(String(s))}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <span>+</span>
                        Add Goal
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                <strong>Note:</strong> This guidance is informational and not a medical or psychological diagnosis. 
                Use it as a starting point for your personal growth journey.
              </p>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <SelfAssessmentModal
          onSuccess={async () => {
            setShowModal(false);
            try {
              const token = localStorage.getItem('token');
              if (!token) return;
              
              // Refresh self-assessment data
              const res = await api.get('/api/self-assessment', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const list = extractList(res?.data);
              setSa(list.length ? normalizeSelfAssessment(list[0]) : null);
              
              // Show success message about XP earned
              showNotification('success', 'Assessment Updated!', 'Your self-assessment has been updated and you earned XP!');
            } catch (error) {
              console.error('Failed to refresh self-assessment data:', error);
            }
          }}
        />
      )}
    </div>
  );
}

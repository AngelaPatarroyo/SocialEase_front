'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import SelfAssessmentModal from '@/components/SelfAssessmentModal';
import {
  LABELS,
  extractList,
  normalize,
  type SelfAssessmentView,
} from '@/utils/selfAssessment';

export default function SelfAssessmentPage() {
  const [sa, setSa] = useState<SelfAssessmentView | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/self-assessment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = extractList(res?.data);
        setSa(list.length ? normalize(list[0]) : null);
      } catch (e) {
        console.error('Failed to load self-assessment', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addGoal = async (title: string, target = 1, daysFromNow = 7) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const deadline = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      // de-dupe against server
      const existing = await api.get('/goals', { headers: { Authorization: `Bearer ${token}` } });
      const exists = (existing.data?.data || [])
        .some((g: any) => String(g.title || '').toLowerCase() === title.toLowerCase());
      if (exists) {
        await Swal.fire('Already added', 'This goal is already on your dashboard.', 'info');
        return;
      }

      await api.post('/goals', { title, target, deadline }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Swal.fire({ title: 'Added!', text: 'Goal added to your dashboard.', icon: 'success' });
    } catch {
      await Swal.fire('Error', 'Could not add this goal.', 'error');
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
    const existing = await api.get('/goals', { headers: { Authorization: `Bearer ${token}` } });
    const existingTitles = new Set(
      (existing.data?.data || []).map((g: any) => String(g.title || '').toLowerCase())
    );

    const payloads = uniqueBatch
      .filter(t => !existingTitles.has(t.toLowerCase()))
      .map(t => ({ title: t, target, deadline }));

    if (payloads.length === 0) {
      await Swal.fire('All set', 'These goals are already on your dashboard.', 'info');
      return;
    }

    try {
      await Promise.all(payloads.map(p =>
        api.post('/goals', p, { headers: { Authorization: `Bearer ${token}` } })
      ));
      await Swal.fire({ title: 'Goals added', icon: 'success' });
    } catch (e) {
      console.error(e);
      await Swal.fire('Error', 'Failed to add goals', 'error');
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

        {loading && <p className="text-gray-600 dark:text-gray-300">Loading…</p>}

        {!loading && !sa && (
          <p className="text-gray-600 dark:text-gray-300">
            No self-assessment yet. Start one to get personalized suggestions.
          </p>
        )}

        {!loading && sa && (
          <>
            <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mt-2">Your Answers</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
              {Object.entries(sa.answers).map(([k, v]) => (
                <li key={k}>
                  <span className="font-medium">{LABELS[k as keyof typeof LABELS] ?? k}:</span>{' '}
                  {Array.isArray(v) ? v.join(', ') : String(v ?? '')}
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mt-6">
              Suggested next steps
            </h2>
            <ul className="space-y-2">
              {sa.insights.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-200">{s}</span>
                  <button
                    onClick={() => addGoal(String(s))}
                    className="text-xs px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Add as goal
                  </button>
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              This guidance is informational and not a medical or psychological diagnosis.
            </p>
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
              const res = await api.get('/self-assessment', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const list = extractList(res?.data);
              setSa(list.length ? normalize(list[0]) : null);
              
              // Show success message about XP earned
              await Swal.fire({
                title: 'Assessment Updated! 🎉',
                text: 'Your self-assessment has been updated and you earned XP!',
                icon: 'success',
                confirmButtonColor: '#4F46E5',
              });
            } catch (error) {
              console.error('Failed to refresh self-assessment data:', error);
            }
          }}
        />
      )}
    </div>
  );
}

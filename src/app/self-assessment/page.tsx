'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
              {sa.insights.suggestions.map((s, i) => <li key={i}>{s}</li>)}
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
              const res = await api.get('/self-assessment', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const list = extractList(res?.data);
              setSa(list.length ? normalize(list[0]) : null);
            } catch {}
          }}
        />
      )}
    </div>
  );
}

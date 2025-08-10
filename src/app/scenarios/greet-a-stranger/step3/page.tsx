'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import api from '@/utils/api';

export default function Step3Feedback() {
  const router = useRouter();
  const sp = useSearchParams();

  const [scenarioParam, setScenarioParam] = useState<string | null>(null);
  const [paramsReady, setParamsReady] = useState(false);

  useEffect(() => {
    // read once the client is mounted
    const v = sp.get('scenario') ?? sp.get('scenarioId');
    setScenarioParam(v?.trim() || null);
    setParamsReady(true);
  }, [sp]);

  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect ONLY after params are ready
  useEffect(() => {
    if (!paramsReady) return;
    if (!scenarioParam || scenarioParam === 'REPLACE_WITH_REAL_SCENARIO_OBJECTID') {
      setError('Invalid or missing scenario identifier.');
      router.replace('/dashboard');
    }
  }, [paramsReady, scenarioParam, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioParam) return;
  
    setSubmitting(true);
    setError(null);
  
    try {
      const numRating = Number(rating);
      if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
        setError('Please select a rating between 1 and 5.');
        setSubmitting(false);
        return;
      }
  
      // 1) Feedback
      console.log('[submit] POST /api/feedback', { scenarioId: scenarioParam, rating: numRating });
      const res1 = await api.post('/feedback', {
        scenarioId: scenarioParam,
        reflection: reflection.trim(),
        rating: numRating,
      });
      console.log('[submit] feedback OK:', res1.status);
  
      // 2) Progress
      console.log('[submit] POST /api/progress/update', { scenarioId: scenarioParam });
      const res2 = await api.post('/progress/update', { scenarioId: scenarioParam });
      console.log('[submit] progress OK:', res2.status);
  
      router.push('/dashboard?toast=feedback_saved');
    } catch (err: any) {
      const url = err?.response?.config?.url;
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error('[submit] FAILED:', url, status, data);
      const msg =
        data?.message ||
        data?.errors?.[0]?.msg ||
        'Something went wrong.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!paramsReady) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border px-8 py-10 space-y-6">
        <h1 className="text-2xl font-semibold text-indigo-900 text-center">
          How did that feel?
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reflection</label>
            <textarea
              className="mt-1 w-full rounded-xl border p-3 focus:ring-2 focus:ring-indigo-400"
              rows={5}
              placeholder="What went well? What felt hard? What would you try next time?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              How positive did that feel? (1–5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              required
              className="mt-1 w-28 rounded-xl border p-2 focus:ring-2 focus:ring-indigo-400"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value || 3))}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !reflection.trim() || !scenarioParam}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save feedback & finish'}
          </button>
        </form>
      </div>
    </main>
  );
}

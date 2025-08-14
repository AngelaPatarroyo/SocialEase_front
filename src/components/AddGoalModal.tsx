'use client';

import { useState } from 'react';
import { showNotification } from '@/components/Notification';
import api from '@/utils/api';

type Props = {
  onClose: () => void;
  onSuccess: () => void; // call after goal is created so caller can refresh
};

export default function AddGoalModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState<number>(1);
  const [deadline, setDeadline] = useState<string>('');         // yyyy-mm-dd
  const [reminder, setReminder] = useState<string>('');         // yyyy-mm-ddThh:mm
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toISODate = (d: string) => {
    if (!d) return undefined;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? undefined : dt.toISOString().slice(0, 10);
  };

  const toISODateTime = (d: string) => {
    if (!d) return undefined;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? undefined : dt.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a goal title.');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // de-dupe: skip if same title already exists on server
      const existing = await api.get('/goals', { headers: { Authorization: `Bearer ${token}` } });
      const exists = (existing.data?.data || []).some(
        (g: any) => String(g.title || '').toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) {
        setError('There is already a goal with this title.');
        return;
      }

      const payload: any = {
        title: trimmed,
        target: Math.max(1, Number(target) || 1),
      };
      const deadlineISO = toISODate(deadline);
      const reminderISO = toISODateTime(reminder);
      if (deadlineISO) payload.deadline = deadlineISO;
      if (reminderISO) payload.reminder = reminderISO;

      await api.post('/goals', payload, { headers: { Authorization: `Bearer ${token}` } });
      
      showNotification('success', 'Goal Added', 'Your goal has been created successfully.');
      
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Could not create goal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">Add new goal</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 outline-none text-gray-700 dark:text-gray-200 transition-colors"
              placeholder="e.g., Practice small talk twice"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target (count)</label>
            <input
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value || '1', 10))}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 outline-none text-gray-700 dark:text-gray-200 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 outline-none text-gray-700 dark:text-gray-200 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reminder</label>
              <input
                type="datetime-local"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 outline-none text-gray-700 dark:text-gray-200 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Saving…' : 'Save goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

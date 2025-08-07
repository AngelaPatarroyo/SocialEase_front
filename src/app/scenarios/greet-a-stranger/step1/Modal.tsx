'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Step1ModalProps {
  onStart: (data: any) => void;
  scenarioId: string;
}

export default function Step1Modal({ onStart, scenarioId }: Step1ModalProps) {
  const [mood, setMood] = useState(2); // scale 0–4
  const [intention, setIntention] = useState('');
  const [loading, setLoading] = useState(false);

  const moods = ['😣', '😕', '😐', '🙂', '😄'];

  const intentions = [
    'Just try something new',
    'Practice confidence',
    'See if I can say hi today',
    'Surprise myself',
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const payload = JSON.stringify({
        mood,
        intention,
        scenarioId,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/scenarios/preparation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Failed to save: ${result?.message || 'Unknown error'}`);
        return;
      }

      onStart({ mood, intention });
    } catch (err) {
      alert('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Before we begin...
        </h2>

        {/* Mood Selector */}
        <div className="mb-6 text-center">
          <p className="font-medium mb-2">How are you feeling right now?</p>
          <div className="flex justify-center space-x-3">
            {moods.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx)}
                className={`text-3xl ${mood === idx ? 'scale-125' : 'opacity-50'} transition`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Intention Selector */}
        <div className="mb-6">
          <p className="font-medium mb-3 text-center">What would you like to get out of this?</p>
          <div className="space-y-2">
            {intentions.map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="intention"
                  value={opt}
                  checked={intention === opt}
                  onChange={() => setIntention(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || intention === ''}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-xl transition font-semibold ${
              loading || !intention ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Saving...' : 'Let’s go!'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

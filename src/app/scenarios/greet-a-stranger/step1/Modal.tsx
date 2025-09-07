'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/utils/api';

interface Step1ModalProps {
  onStart: (data: any) => void;
}

export default function Step1Modal({ onStart }: Step1ModalProps) {
  const [mood, setMood] = useState(2); // 0–4
  const [intention, setIntention] = useState('');
  const [loading, setLoading] = useState(false);

  const moods = ['Very Low', 'Low', 'Neutral', 'Good', 'Very High'];
  const intentions = [
    'Just try something new',
    'Practice confidence',
    'See if I can say hi today',
    'Surprise myself',
  ];

  const handleSubmit = async () => {
    if (!intention) return;
    
    setLoading(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      onStart({ mood, intention });
      setLoading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg mx-2 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">Before we begin...</h2>

                <div className="mb-6 text-center">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">How are you feeling right now?</p>
          <div className="flex justify-center space-x-2">
            {moods.map((moodText, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mood === idx 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {moodText}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-medium text-gray-700 dark:text-gray-300 text-center mb-3">What would you like to get out of this?</p>
          <div className="space-y-3">
            {intentions.map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="radio"
                  name="intention"
                  value={opt}
                  checked={intention === opt}
                  onChange={() => setIntention(opt)}
                  className="text-indigo-600"
                />
                <span className="text-gray-700 dark:text-gray-300">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || intention === ''}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-medium ${
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

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Step1ModalProps {
  onStart: (data: any) => void;
  scenarioId: string;
}

export default function Step1Modal({ onStart, scenarioId }: Step1ModalProps) {
  const [data, setData] = useState({
    fear: '',
    anxiety: 5,
    support: '',
    visualization: '',
    goal: '',
  });

  const [loading, setLoading] = useState(false);

  const fears = [
    'They might ignore me',
    'They’ll think I’m weird',
    'I won’t know what to say',
    'They might judge me',
  ];

  const supports = [
    'You’ve got this!',
    'Just smile and say hi.',
    'You’ve done harder things.',
    'They’re probably friendly too.',
  ];

  const goals = [
    'Make eye contact and say hi',
    'Ask their name',
    'Say something nice',
    'Just don’t walk away',
  ];

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, anxiety: Number(e.target.value) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }
  
      const payload = JSON.stringify({ ...data, scenarioId });
  
      console.log('🚀 Sending request to:', `${process.env.NEXT_PUBLIC_API_BASE}/scenarios/preparation`);
      console.log('📦 Payload:', payload);
      console.log('🔐 Token:', token);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/scenarios/preparation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ always include if present
        },
        body: payload,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('❌ Failed to save preparation:', result);
        alert(`Failed to save: ${result?.message || result?.error || 'Unknown error'}`);
        return;
      }
  
      console.log('✅ Preparation saved:', result);
      onStart(data); // proceed
    } catch (error: any) {
      console.error('❌ Error saving preparation:', error);
      alert(`Oops! Could not save your preparation. ${error?.message || ''}`);
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
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
          Let’s get ready to greet someone new!
        </h2>

        <div className="space-y-6 text-gray-700">
          {/* 1. Fear */}
          <div>
            <label className="font-medium block mb-2">1. What’s the worst that could happen?</label>
            <div className="space-y-2">
              {fears.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="fear"
                    value={option}
                    checked={data.fear === option}
                    onChange={(e) => setData((prev) => ({ ...prev, fear: e.target.value }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Anxiety Slider */}
          <div>
            <label className="font-medium">2. How anxious do you feel right now? (0–10)</label>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={data.anxiety}
              onChange={handleSlider}
              className="w-full mt-1"
            />
            <div className="text-sm text-right text-indigo-600">{data.anxiety}/10</div>
          </div>

          {/* 3. Supportive Thought */}
          <div>
            <label className="font-medium block mb-2">3. What would a kind friend say to support you?</label>
            <div className="space-y-2">
              {supports.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="support"
                    value={option}
                    checked={data.support === option}
                    onChange={(e) => setData((prev) => ({ ...prev, support: e.target.value }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Positive Visualization */}
          <div>
            <label className="font-medium">4. Imagine it goes well — what happens?</label>
            <textarea
              name="visualization"
              value={data.visualization}
              onChange={(e) => setData((prev) => ({ ...prev, visualization: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg p-3 mt-1"
              rows={2}
              placeholder="E.g. They smile back and say hi too."
            />
          </div>

          {/* 5. Goal */}
          <div>
            <label className="font-medium block mb-2">5. What’s one goal for this scenario?</label>
            <div className="space-y-2">
              {goals.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="goal"
                    value={option}
                    checked={data.goal === option}
                    onChange={(e) => setData((prev) => ({ ...prev, goal: e.target.value }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-indigo-600 text-white px-6 py-3 rounded-xl transition font-semibold ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Saving...' : 'I’m ready. Start now'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

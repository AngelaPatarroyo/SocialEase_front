'use client';

import { useState } from 'react';
import api from '@/utils/api';
import Swal from 'sweetalert2';

export default function Step3({
  scenarioId,
  confidenceBefore,
  profileData,
  onSuccess,
}: {
  scenarioId: string;
  confidenceBefore: number;
  profileData: any;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    confidenceAfter: 3,
    reflectionPositive: '',
    reflectionNegative: '',
    reflectionNegativeThoughts: '',
    reflectionAlternativeThoughts: '',
    reflectionActionPlan: '',
    reflectionCompassion: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      scenarioId,
      confidenceBefore,
      confidenceAfter: formData.confidenceAfter,
      reflectionPositive: formData.reflectionPositive,
      reflectionNegative: formData.reflectionNegative,
      reflectionNegativeThoughts: formData.reflectionNegativeThoughts,
      reflectionAlternativeThoughts: formData.reflectionAlternativeThoughts,
      reflectionActionPlan: formData.reflectionActionPlan,
      reflectionCompassion: formData.reflectionCompassion,
      socialLevel: profileData?.socialLevel || 'medium',
      primaryGoal: profileData?.primaryGoal || '',
      comfortZones: profileData?.comfortZones || [],
      preferredScenarios: profileData?.preferredScenarios || [],
      anxietyTriggers: profileData?.anxietyTriggers || [],
      socialFrequency: profileData?.socialFrequency || '',
      communicationConfidence: confidenceBefore, // ✅ use Step 2 confidence for backend calculation
    };

    try {
      console.log('📤 Submitting payload:', payload);
      const res = await api.post('/self-assessment', payload);
      localStorage.setItem('selfAssessmentCompleted', 'true');
      localStorage.setItem('lastAssessmentId', res.data.data._id); // optional: store assessment ID
      Swal.fire('Well done!', 'Your reflection was submitted successfully.', 'success');
      onSuccess();
    } catch (err) {
      console.error('❌ Reflection submission failed:', err);
      Swal.fire('Oops!', 'Something went wrong. Try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-200 mb-4">
        Step 3: Reflect on Your Scenario
      </h2>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Confidence now (1-10): {formData.confidenceAfter}
        <input
          type="range"
          name="confidenceAfter"
          min="1"
          max="10"
          value={formData.confidenceAfter}
          onChange={handleChange}
          className="w-full"
        />
      </label>

      {[
        {
          name: 'reflectionPositive',
          placeholder: 'What went well or felt comfortable?',
        },
        {
          name: 'reflectionNegative',
          placeholder: 'What was difficult or uncomfortable?',
        },
        {
          name: 'reflectionNegativeThoughts',
          placeholder: 'Did you notice any negative thoughts?',
        },
        {
          name: 'reflectionAlternativeThoughts',
          placeholder: 'What alternative or kind thoughts could you consider?',
        },
        {
          name: 'reflectionActionPlan',
          placeholder: 'What is one small step you can take next time?',
        },
        {
          name: 'reflectionCompassion',
          placeholder: 'What would you say to a friend who had the same experience?',
        },
      ].map(({ name, placeholder }) => (
        <textarea
          key={name}
          name={name}
          placeholder={placeholder}
          value={(formData as any)[name]}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          rows={3}
          required
        />
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit Reflection'}
      </button>
    </form>
  );
}

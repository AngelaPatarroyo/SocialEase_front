'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Step3({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [data, setData] = useState({
    confidenceAfter: 5,
    primaryGoal: '',
    comfortZones: [] as string[],
    preferredScenarios: [] as string[],
    anxietyTriggers: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const required = [
      'confidenceAfter',
      'primaryGoal',
      'comfortZones',
      'preferredScenarios',
      'anxietyTriggers',
    ];

    const allFilled = required.every((key) => {
      const value = data[key as keyof typeof data];
      return Array.isArray(value) ? value.length > 0 : value !== '';
    });

    if (allFilled) {
      setSubmitting(true);
      try {
        await onSubmit(data);
      } finally {
        setSubmitting(false);
      }
    } else {
      alert('Please complete all fields before submitting.');
    }
  };

  const getConfidenceLabel = (value: number) => {
    if (value <= 2) return 'Very Low';
    if (value <= 4) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Good';
    return 'Very High';
  };

  const getConfidenceColor = (value: number) => {
    return 'text-indigo-600 dark:text-indigo-400';
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="text-center space-y-1">
        
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Final Step
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Goals & preferences
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
        <div className="h-1 bg-indigo-500 rounded-full transition-all" style={{ width: '100%' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {/* Primary Goal */}
        <div className="space-y-1">
          <label className="block font-medium text-sm text-gray-800 dark:text-gray-200">
            Main goal?
          </label>
          <input
            type="text"
            name="primaryGoal"
            value={data.primaryGoal}
            onChange={handleChange}
            className="w-full px-2 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 text-sm"
            placeholder="e.g., Improve small talk, Build confidence..."
          />
        </div>

        {/* Confidence After Assessment */}
        <div className="space-y-2">
          <label className="block font-medium text-sm text-gray-800 dark:text-gray-200">
            Confidence now?
          </label>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {data.confidenceAfter}
            </div>
            <div className={`text-sm font-semibold ${getConfidenceColor(data.confidenceAfter)}`}>
              {getConfidenceLabel(data.confidenceAfter)} Confidence
            </div>
            
            <div className="relative px-2">
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-1.5 bg-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.confidenceAfter / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <motion.div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow cursor-pointer transform -translate-y-1/2 -translate-x-2"
                style={{ left: `${(data.confidenceAfter / 10) * 100}%` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              
              <input
                type="range"
                name="confidenceAfter"
                min="1"
                max="10"
                value={data.confidenceAfter}
                onChange={(e) => setData({ ...data, confidenceAfter: Number(e.target.value) })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>1 Low</span>
              <span>5 Mod</span>
              <span>10 High</span>
            </div>
          </div>
        </div>

        {/* Comfort Zones */}
        <div className="space-y-1">
          <label className="block font-medium text-sm text-gray-800 dark:text-gray-200">
            Comfort zones?
          </label>
          <MultiSelect
            options={['Home', 'With friends', 'Online spaces', 'Work', 'One-on-one settings']}
            selected={data.comfortZones}
            onChange={(values) => setData({ ...data, comfortZones: values })}
          />
        </div>

        {/* Preferred Scenarios */}
        <div className="space-y-1">
          <label className="block font-medium text-sm text-gray-800 dark:text-gray-200">
            Interesting scenarios?
          </label>
          <MultiSelect
            options={['Small talk', 'Group conversations', 'Public speaking', 'Workplace interactions', 'Meeting new people', 'Handling criticism', 'Setting boundaries']}
            selected={data.preferredScenarios}
            onChange={(values) => setData({ ...data, preferredScenarios: values })}
          />
        </div>

        {/* Anxiety Triggers */}
        <div className="space-y-1">
          <label className="block font-medium text-sm text-gray-800 dark:text-gray-200">
            Anxiety triggers?
          </label>
          <MultiSelect
            options={['Large groups', 'Speaking in public', 'Meeting strangers', 'Being judged', 'Conflict situations', 'Performance pressure', 'Unfamiliar environments']}
            selected={data.anxietyTriggers}
            onChange={(values) => setData({ ...data, anxietyTriggers: values })}
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-1"
      >
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
            submitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Completing...
            </div>
          ) : (
            'Complete Assessment'
          )}
        </button>
      </motion.div>
    </div>
  );
}

// MultiSelect component for better UX
function MultiSelect({ 
  label, 
  options, 
  selected, 
  onChange 
}: { 
  label?: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      )}
      <div className="grid grid-cols-2 gap-1">
        {options.map((option) => (
          <motion.button
            key={option}
            onClick={() => toggleOption(option)}
            className={`p-1.5 rounded border transition-all duration-200 text-xs font-medium ${
              selected.includes(option)
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Selected: {selected.join(', ')}
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Step2({ onNext }: { onNext: (confidence: number) => void }) {
  const [confidence, setConfidence] = useState(1);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Confidence Level
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current level?
          </p>
        </div>
      </div>

      {/* Confidence Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        {/* Current Confidence Value */}
        <div className="space-y-1">
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {confidence}
          </div>
          <div className={`text-lg font-semibold ${getConfidenceColor(confidence)}`}>
            {getConfidenceLabel(confidence)} Confidence
          </div>

        </div>

        {/* Confidence Slider */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Social confidence?
          </label>
          
          <div className="relative px-4">
            {/* Slider Track */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
              className="h-2 bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(confidence / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            </div>
            
            {/* Slider Handle */}
            <motion.div
              className="absolute top-1/2 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-2.5"
              style={{ left: `${(confidence / 10) * 100}%` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Slider Input */}
            <input
              type="range"
              min="1"
              max="10"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Scale Labels */}
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
              <span>1 Very Low</span>
              <span>5 Moderate</span>
              <span>10 Very High</span>
            </div>
        </div>

        {/* Confidence Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong>Note:</strong> Current feeling. Grows with practice.
          </p>
        </motion.div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <button
          onClick={() => onNext(confidence)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
        >
          Continue to Next Step →
        </button>
      </motion.div>
    </div>
  );
}

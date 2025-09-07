'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  label: string;
  options: string[];
  key: string;
}

export default function Step1({ onNext }: { onNext: (profileData: any) => void }) {
  const questions: Question[] = [
    {
      label: 'Social comfort level?',
      key: 'socialComfort',
      options: [
        'Very comfortable',
        'Generally fine',
        'Often anxious',
        'Very anxious',
      ],
    },
    {
      label: 'Avoid social activities?',
      key: 'avoidance',
      options: ['Rarely', 'Sometimes', 'Often', 'Always'],
    },
    {
      label: 'Starting conversations?',
      key: 'conversationConfidence',
      options: [
        'Very confident',
        'Somewhat confident',
        'Not confident',
        'Not at all',
      ],
    },
    {
      label: 'After interactions?',
      key: 'postInteraction',
      options: [
        'Proud',
        'Neutral',
        'Self-critical',
        'Upset',
      ],
    },
    {
      label: 'Recent experiences?',
      key: 'recentExperiences',
      options: [
        'Mostly positive',
        'Mixed',
        'Mostly negative',
        'Limited',
      ],
    },
    {
      label: 'Main motivation?',
      key: 'motivation',
      options: [
        'Build confidence',
        'Reduce anxiety',
        'Prepare',
        'Connect',
      ],
    },
    {
      label: 'Social frequency?',
      key: 'socialFrequency',
      options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
    },
    {
      label: 'Communication skills?',
      key: 'communicationConfidence',
      options: [
        'Very confident',
        'Somewhat confident',
        'Not confident',
        'Not at all',
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [profileData, setProfileData] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const total = questions.length;
  const progress = ((currentQuestion + 1) / total) * 100;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      const questionKey = questions[currentQuestion].key;
      const newData = { ...profileData, [questionKey]: option };
      setProfileData(newData);
      
      if (currentQuestion < total - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Last question completed
        onNext(newData);
      }
    }, 300);
  };

  const getProgressColor = () => {
    return 'from-indigo-500 to-indigo-600';
  };

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="text-center space-y-2">
        
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Question {currentQuestion + 1} of {total}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Let's understand your social comfort level
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-2 bg-gradient-to-r ${getProgressColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Current Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
            {questions[currentQuestion].label}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedOption === option
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-800 dark:text-white">{option}</span>
                {selectedOption === option && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`px-3 py-1 rounded-lg transition-colors text-sm ${
            currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'
          }`}
        >
          ← Previous
        </button>
        
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentQuestion + 1} of {total}
        </span>
      </div>
    </div>
  );
}

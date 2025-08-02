'use client';

import { useState } from 'react';

interface Question {
  label: string;
  options: string[];
  key: string;
}

export default function Step1({ onNext }: { onNext: (profileData: any) => void }) {
  const questions: Question[] = [
    {
      label: 'How do you currently feel in everyday social situations?',
      key: 'socialComfort',
      options: [
        'Very comfortable – I enjoy them.',
        'Generally fine, but I sometimes feel awkward.',
        'Often anxious or unsure how to act.',
        'Very anxious – I avoid them when possible.',
      ],
    },
    {
      label: 'How often do you avoid social activities you’d like to attend?',
      key: 'avoidance',
      options: ['Rarely or never', 'Occasionally', 'Often', 'Almost always'],
    },
    {
      label: 'How confident do you feel in starting conversations?',
      key: 'conversationConfidence',
      options: [
        'Very confident',
        'Somewhat confident',
        'Not very confident',
        'Not at all confident',
      ],
    },
    {
      label: 'How do you typically feel after social interactions?',
      key: 'postInteraction',
      options: [
        'Proud and satisfied',
        'Neutral or slightly unsure',
        'Self-critical or embarrassed',
        'Very upset or ashamed',
      ],
    },
    {
      label: 'Which best describes your recent social experiences?',
      key: 'recentExperiences',
      options: [
        'Mostly positive',
        'Mixed — some good, some bad',
        'Mostly negative or difficult',
        'Very limited or none',
      ],
    },
    {
      label: 'What is your main motivation for using this app?',
      key: 'motivation',
      options: [
        'To build confidence in social situations',
        'To reduce anxiety symptoms',
        'To prepare for specific challenges (e.g. public speaking)',
        'To feel more connected and less isolated',
      ],
    },
    {
      label: 'How often do you engage in social activities?',
      key: 'socialFrequency',
      options: ['Daily', 'Weekly', 'Monthly', 'Rarely or never'],
    },
    {
      label: 'How confident are you in your communication skills?',
      key: 'communicationConfidence',
      options: [
        'Very confident',
        'Somewhat confident',
        'Not very confident',
        'Not at all confident',
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [profileData, setProfileData] = useState<any>({});

  const total = questions.length;

  const getProgressColor = (index: number) => {
    const colors = [
      'bg-yellow-400',
      'bg-orange-400',
      'bg-green-400',
      'bg-blue-400',
      'bg-indigo-500',
      'bg-purple-500',
    ];
    return colors[index] || 'bg-indigo-500';
  };

  const handleOptionClick = (value: string) => {
    const currentKey = questions[step].key;
    const updatedData = { ...profileData, [currentKey]: value };
    setProfileData(updatedData);

    if (step + 1 < total) {
      setStep((prev) => prev + 1);
    } else {
      onNext(updatedData);
    }
  };

  const q = questions[step];

  return (
    <div className="w-full space-y-6">
      <div className="text-sm text-gray-500">Step {step + 1} of {total}</div>

      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className={`h-2 ${getProgressColor(step)} rounded transition-all`}
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-semibold text-indigo-800 dark:text-white">{q.label}</h2>

      <div className="space-y-3">
        {q.options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className="w-full py-3 px-4 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700 text-indigo-800 dark:text-white font-medium shadow-sm transition"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

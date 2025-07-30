'use client';

import { useState } from 'react';

interface Question {
  label: string;
  type: 'buttons' | 'input' | 'checkbox';
  key: string;
  options?: { id: string; label: string }[] | string[];
}

export default function Step1({
  onNext,
}: {
  onNext: (scenarioId: string, profileData: any) => void;
}) {
  const [step, setStep] = useState(0);
  const [scenarioId, setScenarioId] = useState('');
  const [profileData, setProfileData] = useState({
    socialLevel: 'medium',
    primaryGoal: '',
    comfortZones: [] as string[],
    preferredScenarios: [] as string[],
    anxietyTriggers: [] as string[],
    socialFrequency: '',
  });

  const questions: Question[] = [
    {
      label: 'Which scenario would you like to practice?',
      type: 'buttons',
      key: 'scenarioId',
      options: [
        { id: 'smalltalk', label: 'Starting Small Talk' },
        { id: 'groupchat', label: 'Joining a Group Conversation' },
        { id: 'meeting', label: 'Speaking in a Meeting' },
      ],
    },
    {
      label: 'What is your primary goal?',
      type: 'input',
      key: 'primaryGoal',
    },
    {
      label: 'Which settings do you feel most comfortable in?',
      type: 'checkbox',
      key: 'comfortZones',
      options: ['Work', 'Friends', 'Online'],
    },
    {
      label: 'What types of scenarios do you want to practice?',
      type: 'checkbox',
      key: 'preferredScenarios',
      options: ['Networking', 'Public Speaking'],
    },
    {
      label: 'What tends to trigger your anxiety?',
      type: 'checkbox',
      key: 'anxietyTriggers',
      options: ['Crowded places', 'Eye contact'],
    },
    {
      label: 'How often are you in social situations?',
      type: 'input',
      key: 'socialFrequency',
    },
  ];

  const handleNext = () => setStep((prev) => prev + 1);

  const handleButton = (id: string) => {
    setScenarioId(id);
    handleNext();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [questions[step].key]: e.target.value });
  };

  const handleCheckbox = (value: string) => {
    const key = questions[step].key;
    const current = new Set(profileData[key as keyof typeof profileData]);
    current.has(value) ? current.delete(value) : current.add(value);
    setProfileData({ ...profileData, [key]: Array.from(current) });
  };

  const isLast = step === questions.length - 1;
  const q = questions[step];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
        {q.label}
      </h2>

      {q.type === 'buttons' &&
        (q.options as { id: string; label: string }[]).map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleButton(opt.id)}
            className="w-full py-2 px-4 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-white"
          >
            {opt.label}
          </button>
        ))}

      {q.type === 'input' && (
        <input
          type="text"
          value={profileData[q.key as keyof typeof profileData] as string}
          onChange={handleInput}
          className="w-full p-3 border rounded"
        />
      )}

      {q.type === 'checkbox' &&
        (q.options as string[]).map((opt) => (
          <label key={opt} className="block">
            <input
              type="checkbox"
              checked={(profileData[q.key as keyof typeof profileData] as string[]).includes(opt)}
              onChange={() => handleCheckbox(opt)}
            />{' '}
            {opt}
          </label>
        ))}

      {q.type !== 'buttons' && (
        <button
          onClick={isLast ? () => onNext(scenarioId, profileData) : handleNext}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          {isLast ? 'Continue to Step 2' : 'Next'}
        </button>
      )}
    </div>
  );
}

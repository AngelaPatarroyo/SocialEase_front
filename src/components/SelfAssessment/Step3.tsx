'use client';

import { useState } from 'react';

export default function Step3({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [data, setData] = useState({
    confidenceAfter: 5,
    primaryGoal: '',
    comfortZones: [] as string[],
    preferredScenarios: [] as string[],
    anxietyTriggers: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
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
      onSubmit(data);
    } else {
      alert('Please complete all fields before submitting.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">Final Step</div>

      <div className="w-full h-2 bg-gray-200 rounded">
        <div className="h-2 bg-indigo-500 rounded transition-all" style={{ width: '100%' }}></div>
      </div>

      <h2 className="text-lg font-semibold text-indigo-800">
        Help us understand your current goals and preferences
      </h2>

      {/* Primary Goal */}
      <div className="space-y-1">
        <label className="block font-medium text-sm">What is your main goal?</label>
        <input
          type="text"
          name="primaryGoal"
          value={data.primaryGoal}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g., Improve small talk"
        />
      </div>

      {/* Confidence After */}
      <div className="space-y-1">
        <label className="block font-medium text-sm">
          How confident do you feel after this assessment? ({data.confidenceAfter})
        </label>
        <input
          type="range"
          name="confidenceAfter"
          min="1"
          max="10"
          value={data.confidenceAfter}
          onChange={(e) =>
            setData({ ...data, confidenceAfter: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      {/* Comfort Zones */}
      <MultiSelect
        label="Where do you feel most comfortable?"
        options={['Home', 'With friends', 'Online spaces', 'Work', 'One-on-one settings']}
        selected={data.comfortZones}
        onChange={(values) => setData({ ...data, comfortZones: values })}
      />

      {/* Preferred Scenarios */}
      <MultiSelect
        label="What types of social situations would you like to improve?"
        options={['Public speaking', 'Networking', 'Dating', 'Group conversations', 'Phone calls']}
        selected={data.preferredScenarios}
        onChange={(values) => setData({ ...data, preferredScenarios: values })}
      />

      {/* Anxiety Triggers */}
      <MultiSelect
        label="What tends to trigger your anxiety?"
        options={['Crowds', 'Being watched', 'Silence', 'Authority figures', 'New people']}
        selected={data.anxietyTriggers}
        onChange={(values) => setData({ ...data, anxietyTriggers: values })}
      />

      <button
        onClick={handleSubmit}
        className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        Submit Assessment
      </button>
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block font-medium text-sm">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-3 py-1 rounded-full border text-sm ${
              selected.includes(option)
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function Step2({
  onNext,
  onBack,
}: {
  onNext: (confidence: number) => void;
  onBack: () => void;
}) {
  const [confidence, setConfidence] = useState(3);

  const handleSubmit = () => {
    onNext(confidence);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
        How confident do you feel about facing this scenario?
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        There’s no right or wrong answer — just answer honestly for your own awareness.
      </p>
      <div>
        <label className="block text-sm font-medium mb-1">
          Confidence Level: {confidence}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:underline">
          ⬅ Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Continue ➡
        </button>
      </div>
    </div>
  );
}
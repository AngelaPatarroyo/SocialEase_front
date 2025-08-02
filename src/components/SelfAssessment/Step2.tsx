'use client';

import { useState } from 'react';

export default function Step2({ onNext }: { onNext: (confidence: number) => void }) {
  const [confidence, setConfidence] = useState(5);

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">Final Step</div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-green-500 rounded transition-all"
          style={{ width: `100%` }}
        />
      </div>

      <h2 className="text-lg font-semibold text-indigo-800">
        On a scale of 1 to 10, how confident do you feel about social situations right now?
      </h2>

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

      <button
        onClick={() => onNext(confidence)}
        className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        Finish Assessment
      </button>
    </div>
  );
}

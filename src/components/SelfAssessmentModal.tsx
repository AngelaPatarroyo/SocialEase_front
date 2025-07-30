'use client';

import { useState } from 'react';
import Step1 from './SelfAssessment/Step1';
import Step2 from './SelfAssessment/Step2';
import Step3 from './SelfAssessment/Step3'; // your existing Step3.tsx

export default function SelfAssessmentModal() {
  const [step, setStep] = useState(1);

  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleScenarioSelected = (id: string) => {
    setScenarioId(id);
    setStep(2);
  };

  const handleConfidenceSelected = (value: number) => {
    setConfidenceBefore(value);
    setStep(3);
  };

  const handleFinish = () => {
    localStorage.setItem('selfAssessmentCompleted', 'true');
    setCompleted(true);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  if (completed) return null;

  return (
    <div className="fixed inset-0 bg-white/90 z-50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-xl">
        {step === 1 && <Step1 onNext={handleScenarioSelected} />}
        {step === 2 && scenarioId && (
          <Step2 onNext={handleConfidenceSelected} onBack={handleBack} />
        )}
        {step === 3 && scenarioId && confidenceBefore !== null && (
          <Step3
            scenarioId={scenarioId}
            confidenceBefore={confidenceBefore}
            onSuccess={handleFinish} profileData={undefined}          />
        )}
      </div>
    </div>
  );
}

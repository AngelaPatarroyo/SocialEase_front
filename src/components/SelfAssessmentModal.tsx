'use client';

import { useEffect, useRef, useState } from 'react';
import Step1 from './SelfAssessment/Step1';
import Step2 from './SelfAssessment/Step2';
import Step3 from './SelfAssessment/Step3';

interface SelfAssessmentModalProps {
  onSuccess?: (payload: any) => void | Promise<void>; // send payload to parent
  onClose?: () => void;                               // allow closing
}

export default function SelfAssessmentModal({ onSuccess, onClose }: SelfAssessmentModalProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<any>(null);
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Backdrop click to close
  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose?.();
  };

  const handleDataCollected = (data: any) => {
    setProfileData(data);
    setStep(2);
  };

  const handleConfidenceSelected = (confidence: number) => {
    setConfidenceBefore(confidence);
    setStep(3);
  };

  // Build payload and send to parent
  const handleFinalSubmit = async (reflectionData: any) => {
    if (!profileData || confidenceBefore === null) return;

    const payload = {
      confidenceBefore,
      confidenceAfter: reflectionData.confidenceAfter,
      primaryGoal: reflectionData.primaryGoal,
      comfortZones: reflectionData.comfortZones,
      preferredScenarios: reflectionData.preferredScenarios,
      anxietyTriggers: reflectionData.anxietyTriggers,
      socialFrequency: profileData.socialFrequency,
      communicationConfidence:
        profileData.communicationConfidence || profileData.conversationConfidence,
    };

    setCompleted(true);
    await onSuccess?.(payload);
    onClose?.();
  };

  if (completed) return null;

  return (
    <div
      ref={backdropRef}
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div
        className="bg-white dark:bg-gray-800 max-w-lg w-full p-6 rounded-xl shadow-xl"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Self-Assessment</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>

        {/* Steps */}
        {step === 1 && <Step1 onNext={handleDataCollected} />}
        {step === 2 && <Step2 onNext={handleConfidenceSelected} />}
        {step === 3 && <Step3 onSubmit={handleFinalSubmit} />}
      </div>
    </div>
  );
}

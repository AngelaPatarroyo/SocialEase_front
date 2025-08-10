'use client';

import { useEffect, useRef, useState } from 'react';
import Step1 from './SelfAssessment/Step1';
import Step2 from './SelfAssessment/Step2';
import Step3 from './SelfAssessment/Step3';
import Swal from 'sweetalert2';

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

  // Helpers
  const warn = (title: string, text?: string) =>
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#4F46E5',
    });

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

  // Step 1 -> Step 2
  const handleDataCollected = (data: any) => {
    // Basic validation (adjust to match your Step1 field names)
    const hasSocial = data?.socialFrequency != null && data.socialFrequency !== '';
    const comm = data?.communicationConfidence ?? data?.conversationConfidence;
    const hasComm = comm != null && comm !== '';

    if (!hasSocial || !hasComm) {
      warn('Missing fields', 'Please complete your social frequency and confidence.');
      return;
    }
    setProfileData(data);
    setStep(2);
  };

  // Step 2 -> Step 3
  const handleConfidenceSelected = (confidence: number) => {
    if (confidence == null || Number.isNaN(confidence)) {
      warn('Pick a confidence score', 'Please select your current confidence before continuing.');
      return;
    }
    setConfidenceBefore(confidence);
    setStep(3);
  };

  // Final submit
  const handleFinalSubmit = async (reflectionData: any) => {
    // Basic validation for Step 3 (adjust to your field names if needed)
    const {
      confidenceAfter,
      primaryGoal,
      comfortZones,
      preferredScenarios,
      anxietyTriggers,
    } = reflectionData || {};

    if (
      confidenceBefore === null ||
      confidenceAfter == null ||
      !primaryGoal ||
      !Array.isArray(comfortZones) ||
      !Array.isArray(preferredScenarios) ||
      !Array.isArray(anxietyTriggers)
    ) {
      warn('Please complete all fields', 'A few answers are still missing.');
      return;
    }

    if (!profileData) {
      warn('Something went wrong', 'Please restart the self-assessment.');
      return;
    }

    const payload = {
      confidenceBefore,
      confidenceAfter,
      primaryGoal,
      comfortZones,
      preferredScenarios,
      anxietyTriggers,
      socialFrequency: profileData.socialFrequency,
      communicationConfidence:
        profileData.communicationConfidence ?? profileData.conversationConfidence,
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

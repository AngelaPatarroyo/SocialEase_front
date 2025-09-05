'use client';

import { useEffect, useRef, useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { showNotification } from '@/components/common/Notification';
import api from '@/utils/api';

interface SelfAssessmentModalProps {
  onSuccess?: (payload: any) => void | Promise<void>; // send payload to parent
  onClose?: () => void;                               // allow closing
}

export default function SelfAssessmentModal({ onSuccess, onClose }: SelfAssessmentModalProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<any>(null);
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  // Helpers
  const warn = (title: string, text?: string) => {
    showNotification('warning', title, text);
  };

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

    setSubmitting(true);
    try {
      // Submit self-assessment to backend
      const token = localStorage.getItem('token');
      if (!token) {
        warn('Authentication Error', 'Please log in again.');
        return;
      }

      await api.post('/api/self-assessment', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification('success', 'Self-Assessment Complete!', 'You earned 10 XP for completing your self-assessment!');

      setCompleted(true);
      await onSuccess?.(payload);
      onClose?.();
    } catch (error) {
      console.error('Failed to submit self-assessment:', error);
      
      showNotification('error', 'Submission Failed', 'There was an error submitting your self-assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) return null;

  return (
    <div
      ref={backdropRef}
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg mx-2 rounded-xl shadow-xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-600 pb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Self-Assessment</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>

        {/* Steps */}
        {step === 1 && <Step1 onNext={handleDataCollected} />}
        {step === 2 && <Step2 onNext={handleConfidenceSelected} />}
        {step === 3 && <Step3 onSubmit={handleFinalSubmit} />}

        {/* Loading state */}
        {submitting && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Submitting your assessment...</p>
          </div>
        )}
      </div>
    </div>
  );
}
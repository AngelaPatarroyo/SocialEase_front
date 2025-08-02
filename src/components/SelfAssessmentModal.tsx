'use client';

import { useState } from 'react';
import Step1 from './SelfAssessment/Step1';
import Step2 from './SelfAssessment/Step2';
import Step3 from './SelfAssessment/Step3';
import api from '@/utils/api';
import Swal from 'sweetalert2';

interface SelfAssessmentModalProps {
  onSuccess?: () => void;
}

export default function SelfAssessmentModal({ onSuccess }: SelfAssessmentModalProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<any>(null);
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleDataCollected = (data: any) => {
    setProfileData(data);
    setStep(2);
  };

  const handleConfidenceSelected = (confidence: number) => {
    setConfidenceBefore(confidence);
    setStep(3);
  };

  const handleFinalSubmit = async (reflectionData: any) => {
    const token = localStorage.getItem('token');
    if (!token || !profileData || confidenceBefore === null) return;

    try {
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

      console.log('🧾 Submitting self-assessment payload:', JSON.stringify(payload, null, 2));

      await api.post('/self-assessment', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem('selfAssessmentCompleted', 'true');
      setCompleted(true);

      // 🎉 SweetAlert popup
      Swal.fire({
        title: 'Great job!',
        text: 'Your self-assessment was submitted successfully. You’ve earned XP!',
        icon: 'success',
        confirmButtonText: 'See My Progress',
      }).then(() => {
        const statsSection = document.getElementById('xp-stats');
        if (statsSection) {
          statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      if (onSuccess) onSuccess();

    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      console.error('❌ Failed to submit self-assessment:', message);
      Swal.fire('Oops!', message, 'error');
    }
  };

  if (completed) return null;

  return (
    <div className="fixed inset-0 bg-white/90 z-50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-xl">
        {step === 1 && <Step1 onNext={handleDataCollected} />}
        {step === 2 && <Step2 onNext={handleConfidenceSelected} />}
        {step === 3 && <Step3 onSubmit={handleFinalSubmit} />}
      </div>
    </div>
  );
}

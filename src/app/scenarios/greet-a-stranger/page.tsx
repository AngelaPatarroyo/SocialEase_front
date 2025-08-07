'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Step1Modal from './step1/Modal';

export default function GreetStrangerScenario() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [prepData, setPrepData] = useState(null);
  const [scenario, setScenario] = useState<any>(null);

  const blobMessages = [
    "Hi there! Ready to try something new?",
    "You're about to walk into a room and see someone you don’t know.",
    "Imagine greeting them with a confident smile. Just practice — no pressure.",
    "Each small step builds your courage.",
    "Let’s begin together!"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);

  const handleNextMessage = () => {
    if (currentMessage < blobMessages.length - 1) {
      setCurrentMessage((prev) => prev + 1);
    } else {
      setShowStartButton(true);
    }
  };

  const handleStart = (data: any) => {
    setPrepData(data);
    setShowModal(false);
    router.push('/scenarios/greet-a-stranger/step2');
  };

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/scenarios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        const matched = json?.data?.find((s: any) => s.slug === 'greet-a-stranger');
        if (matched) {
          setScenario(matched);
        } else {
          console.warn('No matching scenario found for slug greet-a-stranger');
        }
      } catch (error) {
        console.error('Error fetching scenario:', error);
      }
    };

    fetchScenario();
  }, []);

  return (
    <main className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {showModal && scenario && (
        <Step1Modal onStart={handleStart} scenarioId={scenario._id} />
      )}

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-center text-indigo-800 mb-4"
      >
        Greet a Stranger
      </motion.h1>

      <div className="flex flex-col items-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-md text-sm text-gray-700 text-center max-w-md"
        >
          {blobMessages[currentMessage]}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45 -mt-1" />
        </motion.div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="mt-4"
        >
          <Image
            src="/images/mascot.png"
            alt="Supportive Blob Character"
            width={120}
            height={120}
            className="drop-shadow-md"
          />
        </motion.div>

        {!showStartButton && (
          <button
            onClick={handleNextMessage}
            className="mt-4 text-indigo-600 font-medium hover:underline"
          >
            Next
          </button>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <Image
          src="/images/scenarios/stranger.png"
          alt="Greet a Stranger"
          width={300}
          height={300}
          className="rounded-xl shadow-lg"
        />
      </div>

      {showStartButton && scenario && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
          >
            Click to Start Scenario
          </button>
        </div>
      )}
    </main>
  );
}

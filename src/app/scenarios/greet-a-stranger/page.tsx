'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Step1Modal from './step1/Modal';
import api from '@/utils/api';

export default function GreetStrangerScenario() {
  const router = useRouter();

  // UI
  const [i, setI] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // data
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const blobMessages = [
    'Hi there! Ready to try something new?',
    "You’re about to walk into a room and see someone you don’t know.",
    'Imagine greeting them with a confident smile. Just practice no pressure.',
  ];

  const handleNext = () => {
    setI(prev => {
      const next = Math.min(prev + 1, blobMessages.length - 1);
      if (next === blobMessages.length - 1) setShowStartButton(true);
      return next;
    });
  };

  const handleStartScenario = () => setShowModal(true);

  // When Step 1 modal finishes, go to Step 2 WITH scenarioId
  const handleModalStart = () => {
    setShowModal(false);
    if (!scenario?._id) return;
    router.push(`/scenarios/greet-a-stranger/step2?scenarioId=${scenario._id}`);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        
        // Try to fetch from API first
        const { data } = await api.get('/scenarios');
        
        const list = data?.data || data;
        
        if (Array.isArray(list)) {
          const matched = list.find((s: any) => s.slug === 'greet-a-stranger');
          
          if (matched && matched._id) {
            if (!cancelled) setScenario(matched);
            return;
          }
        }
        
        // Fallback: Create a local scenario with a unique ID
        const localScenario = {
          _id: `local-greet-a-stranger-${Date.now()}`,
          slug: 'greet-a-stranger',
          title: 'Greet a Stranger',
          level: 'Beginner',
          xp: 20,
          isLocal: true // Flag to indicate this is local data
        };
        
        if (!cancelled) {
          setScenario(localScenario);
          // Don't show error if we have local data
          setErr(null);
        }
        
      } catch (e: any) {
        // Create local scenario on API failure
        const localScenario = {
          _id: `local-greet-a-stranger-${Date.now()}`,
          slug: 'greet-a-stranger',
          title: 'Greet a Stranger',
          level: 'Beginner',
          xp: 20,
          isLocal: true
        };
        
        if (!cancelled) {
          setScenario(localScenario);
          setErr(null); // Don't show error if we have local data
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // soft transition variants
  const variants = {
    initial: { opacity: 0, y: 6, filter: 'blur(2px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: 'easeOut' } },
    exit:    { opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: 0.35, ease: 'easeIn' } },
  };

  return (
    <main className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {showModal && scenario && (
        <Step1Modal onStart={handleModalStart} scenarioId={scenario._id} />
      )}

      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-center text-indigo-800 mb-8"
      >
        Greet a Stranger
      </motion.h1>

      {loading && <p className="text-center text-gray-500">Loading…</p>}
      {err && <p className="text-center text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          <div className="flex flex-col items-center gap-5 mb-10">
            <div className="relative">
              <div
                className="relative bg-white border border-gray-200 rounded-2xl shadow-md max-w-xl w-fit mx-auto overflow-hidden"
                style={{ padding: '16px 20px' }}
              >
                {/* Invisible sizer keeps height from jumping between messages */}
                <p
                  aria-hidden="true"
                  className="invisible text-lg md:text-xl leading-relaxed text-gray-700 text-center break-words"
                >
                  {blobMessages[i]}
                </p>

                {/* Animated text on top */}
                <div className="absolute inset-0 flex items-center justify-center px-5">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={i}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-lg md:text-xl leading-relaxed text-gray-700 text-center break-words"
                    >
                      {blobMessages[i]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-full w-6 h-6 bg-white border-l border-b border-gray-200 rotate-45 -mt-3" />
              </div>
            </div>

            <Image
              src="/images/mascot.png"
              alt="Supportive Blob Character"
              width={128}
              height={128}
              className="drop-shadow"
            />

            {!showStartButton ? (
              <button
                onClick={handleNext}
                className="mt-1 px-6 py-2.5 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleStartScenario}
                disabled={!scenario?._id}
                className="mt-1 px-6 py-2.5 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-60"
              >
                Start Scenario
              </button>
            )}
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/scenarios/stranger.png"
              alt="Greet a Stranger"
              width={320}
              height={320}
              className="rounded-xl shadow-lg"
              priority
            />
          </div>
        </>
      )}
    </main>
  );
}

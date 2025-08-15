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
    "You're about to walk into a room and see someone you don't know.",
    'Imagine greeting them with a confident smile. Just practice no pressure.',
    '🎧 Tip: Use headphones for the best experience!',
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
    <main className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute bottom-40 left-20 w-20 h-20 bg-blue-200 rounded-full blur-3xl"
        />
      </div>

      {showModal && scenario && (
        <Step1Modal onStart={handleModalStart} scenarioId={scenario._id} />
      )}

      {/* Header with enhanced styling */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <div className="mb-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Greet a Stranger
          </h1>
        </div>
        
        {/* Scenario info cards */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200 shadow-sm"
          >
            <span className="text-sm font-medium text-indigo-700">🎯 Beginner Level</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-sm"
          >
            <span className="text-sm font-medium text-green-700">⭐ 20 XP</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 shadow-sm"
          >
            <span className="text-sm font-medium text-purple-700">⏱️ 5-10 min</span>
          </motion.div>
        </div>
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500">Preparing your scenario...</span>
          </div>
        </motion.div>
      )}
      
      {err && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 bg-red-50 p-4 rounded-xl max-w-md mx-auto"
        >
          {err}
        </motion.div>
      )}

      {!loading && !err && (
        <>
          {/* Enhanced blob interaction area */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div
                className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl max-w-xl w-fit mx-auto overflow-hidden"
                style={{ padding: '20px 24px' }}
              >
                {/* Invisible sizer keeps height from jumping between messages */}
                <p
                  aria-hidden="true"
                  className="invisible text-lg md:text-xl leading-relaxed text-gray-700 text-center break-words"
                >
                  {blobMessages[i]}
                </p>

                {/* Animated text on top */}
                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={i}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-lg md:text-xl leading-relaxed text-gray-700 text-center break-words font-medium"
                    >
                      {blobMessages[i]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Enhanced speech bubble tail */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-8 h-8 bg-white/90 backdrop-blur-sm border-l border-b border-gray-200 rotate-45 -mt-4" />
              </div>
            </motion.div>

            {/* Enhanced mascot with animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <Image
                  src="/images/mascot.png"
                  alt="Supportive Blob Character"
                  width={140}
                  height={140}
                  className="drop-shadow-lg"
                />
                {/* Floating sparkles around mascot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-2 -left-2 text-xl"
                >
                  🌟
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced buttons */}
            {!showStartButton ? (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                onClick={handleNext}
                className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 font-semibold text-lg">Next</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                <motion.button
                  onClick={handleStartScenario}
                  disabled={!scenario?._id}
                  className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                                     <span className="relative z-10 font-bold text-xl">Start Scenario</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>
                
                {/* Progress indicator */}
                <div className="text-center">
                  <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto mb-2">
                    <motion.div
                      className="h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Ready to begin!</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced scenario preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Image
                  src="/images/scenarios/stranger.png"
                  alt="Greet a Stranger"
                  width={360}
                  height={360}
                  className="rounded-2xl shadow-2xl border-4 border-white/50"
                  priority
                />
                {/* Overlay with scenario info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-1">Practice Makes Perfect</h3>
                    <p className="text-sm opacity-90">Step out of your comfort zone and build confidence one greeting at a time.</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements around the image */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                NEW!
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </main>
  );
}

'use client';

import { motion } from 'framer-motion';
import ScenarioCard, { ScenarioCardProps } from '@/components/scenarios/ScenarioCard';
import Link from 'next/link';

const scenarios: ScenarioCardProps[] = [
  {
    title: 'Intro to SocialEase',
    level: 'Beginner',
    xp: 10,
    imageUrl: '/images/scenarios/intro.png',
    slug: 'intro-to-socialease',
  },
  {
    title: 'Order at a Cafe',
    level: 'Beginner',
    xp: 20,
    imageUrl: '/images/scenarios/cafe.png',
    slug: 'order-at-a-cafe',
  },
  {
    title: 'Greet a Stranger',
    level: 'Beginner',
    xp: 20,
    imageUrl: '/images/scenarios/stranger.png',
    slug: 'greet-a-stranger',
  },
  {
    title: 'Say No Politely',
    level: 'Beginner',
    xp: 25,
    imageUrl: '/images/scenarios/say-no.png',
    slug: 'say-no-politely',
  },
  {
    title: 'Start Small Talk',
    level: 'Beginner',
    xp: 25,
    imageUrl: '/images/scenarios/smalltalk.png',
    slug: 'start-small-talk',
  },
  {
    title: 'Join Group Conversation',
    level: 'Beginner',
    xp: 30,
    imageUrl: '/images/scenarios/group.png',
    isVR: true,
    slug: 'join-group-conversation',
  },
  {
    title: 'Talk to a Co-worker',
    level: 'Intermediate',
    xp: 30,
    imageUrl: '/images/scenarios/coworker.png',
    slug: 'talk-to-a-coworker',
  },
  {
    title: 'Give a Compliment',
    level: 'Intermediate',
    xp: 30,
    imageUrl: '/images/scenarios/compliment.png',
    slug: 'give-a-compliment',
  },
  {
    title: 'Ask for Help in Public',
    level: 'Intermediate',
    xp: 30,
    imageUrl: '/images/scenarios/ask-help.png',
    isVR: true,
    slug: 'ask-for-help-in-public',
  },
  {
    title: 'Speak Up in a Group',
    level: 'Intermediate',
    xp: 30,
    imageUrl: '/images/scenarios/speak-up.png',
    slug: 'speak-up-in-a-group',
  },
  {
    title: 'Make a Phone Call',
    level: 'Advanced',
    xp: 35,
    imageUrl: '/images/scenarios/phone.png',
    slug: 'make-a-phone-call',
  },
  {
    title: 'Handle Criticism',
    level: 'Advanced',
    xp: 35,
    imageUrl: '/images/scenarios/criticism.png',
    slug: 'handle-criticism',
  },
  {
    title: 'Disagree Respectfully',
    level: 'Advanced',
    xp: 40,
    imageUrl: '/images/scenarios/disagree.png',
    slug: 'disagree-respectfully',
  },
  {
    title: 'Mock Interview',
    level: 'Advanced',
    xp: 45,
    imageUrl: '/images/scenarios/interview.png',
    isVR: true,
    slug: 'mock-interview',
  },
  {
    title: 'Attend a Networking Event',
    level: 'Advanced',
    xp: 45,
    imageUrl: '/images/scenarios/networking.png',
    isVR: true,
    slug: 'attend-a-networking-event',
  },
];

export default function ScenariosPage() {
  return (
    <main className="min-h-screen px-4 pt-8 pb-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
            <Link 
              href="/goals" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Goals
            </Link>
            <Link 
              href="/self-assessment" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Assessment
            </Link>
            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            

          </div>
        </div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-center text-indigo-800 dark:text-indigo-200 mb-4"
      >
        Social Scenarios
      </motion.h1>

      <p className="text-center text-gray-600 dark:text-gray-300 text-md mb-6">
        Practice real-life social situations and gain XP as you grow!
      </p>

      <div className="flex flex-col items-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl shadow-md text-sm text-gray-700 dark:text-gray-200 text-center max-w-xs"
        >
          Let's take this one step at a time. Pick a scenario you feel ready for!
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600 rotate-45 -mt-1" />
        </motion.div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="mt-3"
        >
          <img
            src="/images/chatter-blob.png"
            alt="Friendly Blob"
            width={160}
            height={160}
            className="drop-shadow-md"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 justify-center max-w-7xl mx-auto"
      >
        {scenarios.map((scenario, idx) => (
          <ScenarioCard key={idx} {...scenario} />
        ))}
      </motion.div>
    </main>
  );
}

'use client';

import { motion } from 'framer-motion';
import ScenarioCard, { ScenarioCardProps } from '@/components/ScenarioCard';
import Image from 'next/image';

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
    <main className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-center text-indigo-800 mb-4"
      >
        Social Scenarios
      </motion.h1>

      <p className="text-center text-gray-600 text-md mb-6">
        Practice real-life social situations and gain XP as you grow!
      </p>

      <div className="flex flex-col items-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-md text-sm text-gray-700 text-center max-w-xs"
        >
          Let’s take this one step at a time. Pick a scenario you feel ready for!
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45 -mt-1" />
        </motion.div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="mt-3"
        >
          <Image
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

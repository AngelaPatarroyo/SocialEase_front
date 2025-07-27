'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const blobs = [
    { name: 'Easy the Blob', img: '/images/easy-blob.png' },
    { name: 'Shy Blob', img: '/images/shy-blob.png' },
    { name: 'Chatter Blob', img: '/images/chatter-blob.png' },
    { name: 'Wizard Blob', img: '/images/wizard-blob.png' },
    { name: 'LOL Blob', img: '/images/lol-blob.png' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center pt-32 px-6 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Practice Social Skills in a Safe Space
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Build confidence at your own pace through guided, judgment-free scenarios.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Start Your Journey
          </Link>
          <Link
            href="#how-it-works"
            className="bg-gray-100 text-indigo-700 px-6 py-3 rounded-xl border hover:bg-gray-200 dark:bg-gray-700 dark:text-white transition"
          >
            Learn How It Works
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12 text-indigo-700 dark:text-indigo-300">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: 'Pick a Scenario',
              desc: 'Choose real-life social situations to practice safely.',
              img: '/images/scenario-icon.png',
            },
            {
              title: 'Reflect & Improve',
              desc: 'Get instant feedback and tips to build confidence.',
              img: '/images/reflect-icon.png',
            },
            {
              title: 'Track Progress',
              desc: 'Celebrate small wins and unlock achievements.',
              img: '/images/progress-icon.png',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <Image
                src={step.img}
                alt={step.title}
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why It Helps */}
      <section className="py-20 px-6 bg-indigo-50 dark:bg-gray-800 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700 dark:text-indigo-300">
          Why SocialEase Works
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          Our approach combines evidence-based Cognitive Behavioral Therapy (CBT) techniques with fun gamification elements.
          You practice scenarios gradually, track your progress, and build confidence one step at a time—all in a safe, supportive environment.
        </p>
      </section>

      {/* Progress Preview */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700 dark:text-indigo-300">
          See Your Progress
        </h2>
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-semibold mb-4">Level 3 – Confident Speaker 🎯</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full mb-4">
            <div className="bg-indigo-600 h-4 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">1200 XP earned • Next badge in 200 XP</p>
        </motion.div>
      </section>

      {/* Companions Section (Blobs) */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700 dark:text-indigo-300">
          Meet Your Friendly Companions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Blobs are here to cheer you on and keep you motivated as you progress!
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {blobs.map((blob, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                delay: index * 0.2,
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              whileHover={{ scale: 1.15, rotate: 5 }}
            >
              <Image
                src={blob.img}
                alt={blob.name}
                width={100}
                height={100}
                className="rounded-full"
              />
              <p className="mt-2 text-sm font-medium">{blob.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 SocialEase | <Link href="/privacy" className="underline">Privacy</Link>
        <div className="mt-2">
          <a href="https://www.nhs.uk/mental-health/" target="_blank" className="underline">NHS Mental Health</a> | 
          <a href="https://www.samaritans.org/" target="_blank" className="underline"> Samaritans</a>
        </div>
        <p className="mt-2 text-xs">SocialEase is not a substitute for professional therapy.</p>
      </footer>
    </div>
  );
}

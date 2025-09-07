'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';

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
      <section className="text-center pt-32 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Master Social Skills
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Without the Anxiety
            </span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Build confidence at your own pace through guided, judgment-free scenarios. 
            Join thousands who've overcome social anxiety with SocialEase.
          </motion.p>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <span>Join users building confidence every day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
            <span>Rated highly by our community</span>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/register"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
          >
            Start Your Journey Free
          </Link>
          <Link
            href="#how-it-works"
            className="bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 px-8 py-4 rounded-2xl border-2 border-indigo-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold text-lg"
          >
            Learn How It Works
          </Link>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 text-indigo-700 dark:text-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Journey to Social Confidence
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: 'Choose Your Challenge',
              desc: 'Start with beginner scenarios like ordering coffee, then progress to advanced situations like job interviews.',
              icon: '🎯',
              color: 'from-blue-500 to-indigo-500'
            },
            {
              title: 'Practice & Reflect',
              desc: 'Complete scenarios at your own pace, submit feedback, and learn from each experience.',
              icon: '💭',
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Grow & Celebrate',
              desc: 'Earn XP, unlock badges, and track your progress through confidence levels.',
              icon: '🏆',
              color: 'from-yellow-500 to-orange-500'
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why It Helps */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-indigo-700 dark:text-indigo-300"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why SocialEase Works
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Evidence-Based Approach
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">✓</div>
                  <p><strong>Cognitive Behavioral Therapy (CBT):</strong> Proven techniques to reframe anxious thoughts</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">✓</div>
                  <p><strong>Gradual Exposure:</strong> Start small and build confidence progressively</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">✓</div>
                  <p><strong>Safe Environment:</strong> Practice without real-world consequences</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">✓</div>
                  <p><strong>Gamification:</strong> Make progress fun with XP, badges, and achievements</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600">
                <div className="text-6xl mb-4">🧠</div>
                <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Science-Backed Results</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Based on research from leading institutions in social anxiety treatment
                </p>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  Evidence-based approach
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Preview */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 text-indigo-700 dark:text-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          See Your Progress in Action
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mr-4">
                  3
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Confident Speaker</h3>
                  <p className="text-gray-600 dark:text-gray-300">Level 3 • 1200 XP earned</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress to Level 4</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold">Next Badge</div>
                  <div className="text-gray-700 dark:text-gray-300">200 XP away</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 font-bold">Scenarios</div>
                  <div className="text-gray-700 dark:text-gray-300">12 completed</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Track Your Growth Journey
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">🎯</div>
                <p><strong>Level Up:</strong> Progress through confidence levels</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">⭐</div>
                <p><strong>Earn XP:</strong> Gain experience points for every scenario</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">🏆</div>
                <p><strong>Unlock Badges:</strong> Celebrate achievements and milestones</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">📊</div>
                <p><strong>Visual Progress:</strong> See your confidence growth over time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companions Section (Blobs) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 text-indigo-700 dark:text-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Meet Your Friendly Companions
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          These adorable blobs are here to cheer you on and keep you motivated as you progress through your social confidence journey!
        </motion.p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { ...blobs[0], personality: 'Always encouraging and positive', color: 'from-blue-400 to-indigo-500' },
            { ...blobs[1], personality: 'Shy but supportive friend', color: 'from-purple-400 to-pink-500' },
            { ...blobs[2], personality: 'Chatty and motivational', color: 'from-green-400 to-teal-500' },
            { ...blobs[3], personality: 'Wise and knowledgeable guide', color: 'from-yellow-400 to-orange-500' },
            { ...blobs[4], personality: 'Fun and celebratory', color: 'from-red-400 to-pink-500' },
          ].map((blob, index) => (
            <motion.div
              key={index}
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="text-center">
                <motion.div
                  className="relative mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    delay: index * 0.2,
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${blob.color} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  <img
                    src={blob.img}
                    alt={blob.name}
                    width={120}
                    height={120}
                    className="relative rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{blob.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{blob.personality}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Social Confidence?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start building your social confidence today through guided practice and reflection. 
            Join our community and begin your journey - it's completely free!
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
            >
              Start Free Today
            </Link>
            <Link
              href="/scenarios"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300 font-semibold text-lg"
            >
              Browse Scenarios
            </Link>
          </motion.div>
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

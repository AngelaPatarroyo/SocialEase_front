'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/user/dashboard'); // ✅ Backend endpoint
        setDashboard(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading your dashboard...</p>;
  }

  if (!dashboard) {
    return <p className="text-center mt-10 text-red-500">Unable to load dashboard data.</p>;
  }

  const {
    user = {},
    stats = { xp: 0, level: 1, streak: 0, badges: [], nextLevelXP: 1000 },
    progress = { completedScenariosCount: 0, recentScenarios: [] },
    messages = [],
    goals = [] // ✅ Include goals from API
  } = dashboard;

  // ✅ Safe avatar handling
  const avatarSrc =
    user?.avatar && user.avatar.trim() !== '' && user.avatar.startsWith('http')
      ? user.avatar
      : '/images/default-avatar.png';

  // ✅ XP Progress calculation
  const progressPercentage =
    stats.nextLevelXP && stats.nextLevelXP > 0
      ? Math.min((stats.xp / stats.nextLevelXP) * 100, 100)
      : 0;

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-white">
            Welcome back, {user.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
            Here’s your progress summary.
          </p>
        </div>
        {/* ✅ Clickable Avatar */}
        <Link href="/profile" title="Click to update your avatar">
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={90}
            height={90}
            className="rounded-full border-4 border-indigo-500 shadow-md hover:scale-105 transition-transform cursor-pointer"
          />
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          href="/scenarios"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition w-full sm:w-auto text-center"
        >
          Start a Scenario
        </Link>
        <Link
          href="/profile"
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto text-center"
        >
          View Profile
        </Link>
        <Link
          href="/goals"
          className="bg-purple-200 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-300 transition w-full sm:w-auto text-center"
        >
          Set a Goal
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* XP */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">XP</h2>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{stats.xp}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-3">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stats.xp}/{stats.nextLevelXP} XP to next level
          </p>
        </div>

        {/* Level */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Level</h2>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{stats.level}</p>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Streak</h2>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{stats.streak} days</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-300">Badges</h2>
        <div className="flex gap-3 flex-wrap">
          {stats.badges.length > 0 ? (
            stats.badges.map((badge: string, index: number) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full dark:bg-indigo-800 dark:text-indigo-200"
              >
                {badge}
              </span>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No badges yet. Complete scenarios to earn some!
            </p>
          )}
        </div>
      </div>

      {/* Goals Widget */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-300">
          Your Goals
        </h2>
        {goals.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {goals.slice(0, 3).map((goal: any, index: number) => (
              <li key={index}>
                <span className="font-medium">{goal.title}</span> - Target: {goal.target}
                {goal.deadline && ` (by ${new Date(goal.deadline).toLocaleDateString()})`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No goals yet. Set one today!</p>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-300">
          Your Progress
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Completed Scenarios: {progress.completedScenariosCount}
        </p>
        <ul className="list-disc list-inside text-gray-500 dark:text-gray-400">
          {progress.recentScenarios.length > 0 ? (
            progress.recentScenarios.map((scenario: string, index: number) => (
              <li key={index}>{scenario}</li>
            ))
          ) : (
            <p className="text-gray-400 dark:text-gray-500">
              No recent scenarios yet. Start practicing today!
            </p>
          )}
        </ul>
      </div>

      {/* Motivational Message */}
      {messages && messages.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-200 p-4 rounded">
          <p className="font-medium">{messages[0]}</p>
        </div>
      )}
    </div>
  );
}

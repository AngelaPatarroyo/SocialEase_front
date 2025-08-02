'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import SelfAssessmentModal from '@/components/SelfAssessmentModal';

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showSelfAssessment, setShowSelfAssessment] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false); // ✅ added

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await api.get('/user/dashboard');
        console.log('✅ Dashboard:', res.data);
        setDashboard(res.data.data);

        const selfAssessmentRes = await api.get('/self-assessment', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hasCompleted = selfAssessmentRes.data.data.length > 0;
        localStorage.setItem('selfAssessmentCompleted', hasCompleted ? 'true' : 'false');
        setShowSelfAssessment(!hasCompleted);
      } catch (err) {
        console.error('❌ Failed to load dashboard or self-assessment:', err);
        setError(true);
      } finally {
        setLoading(false);
        setShouldRefresh(false); // ✅ reset trigger
      }
    };

    fetchDashboard();
  }, [router, shouldRefresh]); // ✅ re-run when refresh flag is set

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading your dashboard...</p>;
  }

  if (error || !dashboard) {
    return <p className="text-center mt-10 text-red-500">Unable to load dashboard data.</p>;
  }

  const {
    user = {},
    stats = { xp: 0, level: 1, streak: 0, badges: [], nextLevelXP: 1000 },
    progress = { completedScenariosCount: 0, recentScenarios: [] },
    messages = [],
    goals = [],
  } = dashboard;

  const displayName = user.name || 'User';
  const avatarSrc = user.avatar?.startsWith('http')
    ? user.avatar
    : '/images/default-avatar.png';

  const progressPercentage =
    stats.nextLevelXP && stats.nextLevelXP > 0
      ? Math.min((stats.xp / stats.nextLevelXP) * 100, 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      {showSelfAssessment && (
        <SelfAssessmentModal onSuccess={() => setShouldRefresh(true)} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-white">
            Hi {displayName}, welcome back! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's how you're progressing.
          </p>
        </div>
        <Link href="/profile" title="Update your profile">
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={90}
            height={90}
            className="rounded-full border-4 border-indigo-500 shadow-md hover:scale-105 transition-transform"
          />
        </Link>
      </div>

      {/* Mascot */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/wizard-blob.png"
          alt="Friendly wizard mascot"
          width={120}
          height={120}
          className="rounded-full shadow-md"
        />
      </div>

      {/* Motivation */}
      <div className="bg-purple-100 dark:bg-indigo-900 rounded-xl p-6 shadow-md text-center mb-6">
        <div className="text-2xl font-semibold text-indigo-700 dark:text-indigo-200">
          You're doing great! 💪
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Complete a scenario to level up your confidence.
        </p>
        <Link
          href="/scenarios"
          className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow"
        >
          Practice now
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="XP" value={stats.xp} />
        <StatCard label="Level" value={`Level ${stats.level}`} />
        <StatCard label="Streak" value={`${stats.streak} days`} />
      </div>

      {/* XP Progress */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow mb-8">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
          XP Progress
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-full">
          <div
            className="bg-indigo-500 h-3 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stats.xp}/{stats.nextLevelXP} XP to next level
        </p>
      </div>

      {/* Suggestions */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
          Suggestions
        </h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
          {progress.completedScenariosCount === 0 ? (
            <li>Start your first scenario to earn XP!</li>
          ) : (
            <>
              <li>Try a more challenging scenario.</li>
              <li>Reflect on your last session for bonus XP.</li>
              <li>Set a new goal to stay motivated.</li>
            </>
          )}
        </ul>
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
          Your Badges
        </h3>
        {stats.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge: string, idx: number) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm dark:bg-indigo-800 dark:text-indigo-100"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No badges yet. Complete scenarios to earn some!
          </p>
        )}
      </div>

      {/* Goals */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-4">
          Your Goals
        </h3>
        {goals.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {goals.slice(0, 3).map((goal: any, index: number) => (
              <li key={index}>
                <span className="font-medium">{goal.title}</span> – Target: {goal.target}
                {goal.deadline &&
                  ` (by ${new Date(goal.deadline).toLocaleDateString()})`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No goals set yet. Set one today!
          </p>
        )}
      </div>

      {/* Recent Scenarios */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
          Recent Scenarios
        </h3>
        {progress.recentScenarios.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {progress.recentScenarios.map((scenario: string, index: number) => (
              <li key={index}>{scenario}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No recent scenarios. Let's get started!
          </p>
        )}
      </div>

      {/* Motivation Message */}
      {messages.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-200 p-4 rounded">
          <p className="font-medium">{messages[0]}</p>
        </div>
      )}
    </div>
  );
}

// Helper: StatCard
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md text-center">
    <h4 className="text-sm text-gray-500 dark:text-gray-300">{label}</h4>
    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{value}</p>
  </div>
);

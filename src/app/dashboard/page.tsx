'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import Image from 'next/image';
import SelfAssessmentModal from '@/components/SelfAssessmentModal';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';
import {
  extractList,
  normalize as normalizeSelfAssessment,
  SCENARIOS,
  type SelfAssessmentView,
} from '@/utils/selfAssessment';

// Map badge keys (strings) to display meta
const BADGE_CATALOG: Record<string, { name: string; image: string }> = {
  first_self_assessment: {
    name: 'First Steps',
    image: '/images/badges/first-steps.png',
  },
  xp_warrior: {
    name: 'XP Warrior',
    image: '/images/badges/xp-warrior.png',
  },
  // add future badges here...
};

// Normalize any badge key/label to our catalog format
const normalizeKey = (s: unknown) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

// 🔢 Simple frontend XP → Level calculator (100 XP per level)
function calculateLevelFromXP(xp: number) {
  const n = Math.max(0, Number(xp) || 0);
  if (n <= 100) return 1;
  if (n <= 200) return 2;
  if (n <= 300) return 3;
  if (n <= 400) return 4;
  if (n <= 500) return 5;
  if (n <= 600) return 6;
  if (n <= 700) return 7;
  if (n <= 800) return 8;
  if (n <= 900) return 9;
  return 10;
}

export default function DashboardPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showSelfAssessment, setShowSelfAssessment] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<SelfAssessmentView | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await api.get('/user/dashboard');
        setDashboard(res.data?.data ?? null);

        const selfAssessmentRes = await api.get('/self-assessment', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = extractList(selfAssessmentRes?.data);
        const hasCompleted = list.length > 0;
        localStorage.setItem('selfAssessmentCompleted', hasCompleted ? 'true' : 'false');
        setShowSelfAssessment(!hasCompleted);

        setSelfAssessment(hasCompleted ? normalizeSelfAssessment(list[0]) : null);

        await refreshProfile();
      } catch (err) {
        console.error('Failed to load dashboard or self-assessment:', err);
        setError(true);
      } finally {
        setLoading(false);
        setShouldRefresh(false);
      }
    };

    fetchAll();
  }, [router, shouldRefresh, refreshProfile]);

  const handleGoToProfile = async () => {
    try {
      await refreshProfile();
      router.push('/profile');
    } catch {
      router.push('/login');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading your dashboard...</p>;
  if (error || !dashboard) return <p className="text-center mt-10 text-red-500">Unable to load dashboard data.</p>;

  const {
    user = {},
    stats = { xp: 0, level: 1, streak: 0, badges: [], nextLevelXP: 100 }, // nextLevelXP kept for backward-compat
    progress = { completedScenariosCount: 0, recentScenarios: [] },
    messages = [],
    goals = [],
  } = dashboard;

  const displayName = user.name || 'User';
  const avatarSrc = user.avatar?.startsWith?.('http') ? user.avatar : '/images/default-avatar.png';

  const xp = Math.max(0, Number(stats.xp || 0));
  const level = calculateLevelFromXP(xp);
  const xpForNextLevel = 100;
  const xpIntoLevel = xp % 100;
  const progressPercentage = xpForNextLevel > 0 ? Math.min((xpIntoLevel / xpForNextLevel) * 100, 100) : 0;

  // badges may come from user.badges or stats.badges
  const rawBadges: any[] = Array.isArray(user.badges) ? user.badges : (Array.isArray(stats.badges) ? stats.badges : []);
  const badges = rawBadges.map((b) => {
    if (typeof b === 'string') {
      const k = normalizeKey(b);
      const meta = BADGE_CATALOG[k] || { name: b, image: '/images/default-badge.png' };
      return { key: k, name: meta.name, image: meta.image };
    }
    // object support: { key, name, image }
    const k = normalizeKey(b.key ?? b.name ?? 'badge');
    const meta = BADGE_CATALOG[k];
    return {
      key: k,
      name: meta?.name ?? (b.name ?? b.key ?? 'Badge'),
      image: meta?.image ?? (b.image ?? '/images/default-badge.png'),
    };
  });

  const recommendedCards = (selfAssessment?.insights?.recommended ?? [])
    .map(r => SCENARIOS.find(s => s.slug === r.slug))
    .filter(Boolean) as Array<{ slug: string; title: string; imageUrl: string; level: string; xp: number }>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      {showSelfAssessment && (
        <SelfAssessmentModal
          onSuccess={async (payload: any) => {
            try {
              const token = localStorage.getItem('token');
              if (!token) return;

              // 1) Submit assessment
              const res = await api.post('/self-assessment', payload, {
                headers: { Authorization: `Bearer ${token}` },
              });

              // read possible fields
              const newBadgeRaw: string | undefined =
                res?.data?.badge || res?.data?.awardedBadge || res?.data?.data?.badge;
              const newBadge = newBadgeRaw ? normalizeKey(newBadgeRaw) : undefined;

              const xpEarned: number | undefined =
                res?.data?.xpEarned ?? res?.data?.data?.xpEarned;

              // 2) Congrats popup (XP + badge)
              let popupText = 'Your self-assessment was submitted successfully.';
              if (typeof xpEarned === 'number') popupText += ` You’ve earned ${xpEarned} XP!`;
              if (newBadge && BADGE_CATALOG[newBadge]) {
                popupText += ` You also earned the “${BADGE_CATALOG[newBadge].name}” badge!`;
              }

              await Swal.fire({
                title: 'Great job!',
                text: popupText,
                icon: 'success',
                confirmButtonText: 'See My Progress',
              }).then(() => {
                document.getElementById('xp-stats')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });

              // 3) Optimistic badge add
              if (newBadge) {
                setDashboard((prev: any) => {
                  if (!prev) return prev;
                  const mergedUserBadges = Array.from(new Set([...(prev.user?.badges || []), newBadge]));
                  const mergedStatsBadges = Array.from(new Set([...(prev.stats?.badges || []), newBadge]));
                  return {
                    ...prev,
                    user: { ...prev.user, badges: mergedUserBadges },
                    stats: { ...prev.stats, badges: mergedStatsBadges },
                  };
                });
              }

              // 4) Force fresh GET (source of truth)
              const fresh = await api.get('/user/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setDashboard(fresh.data?.data ?? null);

            } catch (e) {
              console.error('Failed to submit self-assessment:', e);
            } finally {
              setShowSelfAssessment(false);
            }
          }}
          onClose={() => setShowSelfAssessment(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-white">
            Hi {displayName}, welcome back
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Here is your current progress.</p>
        </div>
        <button
          onClick={handleGoToProfile}
          title="Update your profile"
          className="rounded-full border-4 border-indigo-500 shadow-md hover:scale-105 transition-transform"
        >
          <Image src={avatarSrc} alt="User Avatar" width={90} height={90} className="rounded-full" />
        </button>
      </div>

      {/* Wizard mascot */}
      <div className="flex justify-center mb-6">
        <Image src="/images/wizard-blob.png" alt="Friendly wizard mascot" width={120} height={120} className="rounded-full shadow-md" />
      </div>

      {/* Self-Assessment CTA */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">Self-Assessment</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Complete or review your self-assessment to personalize your plan.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSelfAssessment(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow">
            Update
          </button>
          <Link href="/self-assessment" className="py-2 px-4 rounded-lg border border-indigo-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-600">
            View results
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="XP" value={xp} />
        {/* 🔁 Use frontend-calculated level */}
        <StatCard label="Level" value={`Level ${level}`} />
        <StatCard label="Streak" value={`${stats.streak} days`} />
      </div>

      {/* XP Progress */}
      <div id="xp-stats" className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow mb-8">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">XP Progress</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-full">
          <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${progressPercentage}%` }} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {xpIntoLevel}/{xpForNextLevel} XP in this level
        </p>
      </div>

      {/* Badges */}
      <Section title="Your Badges" titleClass="text-yellow-600 dark:text-yellow-300">
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {badges.map((badge) => (
              <div
                key={badge.key}
                className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <Image
                  src={badge.image}
                  alt={badge.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">You haven’t earned any badges yet. Play scenarios to earn some!</p>
        )}
      </Section>

      {/* Recommended scenarios */}
      <Section title="Recommended scenarios">
        {recommendedCards.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {recommendedCards.map(s => (
                <Link
                  key={s.slug}
                  href={`/scenarios/${s.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-700"
                  aria-label={`Open scenario: ${s.title}`}
                >
                  <div className="relative w-full aspect-[4/3] bg-white dark:bg-gray-800">
                    <Image
                      src={s.imageUrl}
                      alt={s.title}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {s.level} • {s.xp} XP
                    </div>
                    <div className="font-semibold text-indigo-700 dark:text-indigo-200 group-hover:underline">
                      {s.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                href="/scenarios"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-lg"
              >
                Browse all scenarios
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            Complete your self-assessment to get tailored scenario recommendations.
          </p>
        )}
      </Section>

      {/* Goals */}
      <Section title="Your Goals" titleClass="text-purple-600 dark:text-purple-300">
        {goals.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {goals.slice(0, 3).map((goal: any, index: number) => (
              <li key={index}>
                <span className="font-medium">{goal.title}</span> – Target: {goal.target}
                {goal.deadline && ` (by ${new Date(goal.deadline).toLocaleDateString()})`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No goals set yet. Set one today.</p>
        )}
      </Section>

      {/* Recent scenarios */}
      <Section title="Recent Scenarios">
        {(progress?.recentScenarios || []).length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {(progress.recentScenarios || []).map((scenario: string, index: number) => (
              <li key={index}>{scenario}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent scenarios. Let’s get started.</p>
        )}
      </Section>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-200 p-4 rounded">
          <p className="font-medium">{messages[0]}</p>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md text-center">
    <h4 className="text-sm text-gray-500 dark:text-gray-300">{label}</h4>
    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{value}</p>
  </div>
);

const Section = ({
  title,
  children,
  titleClass = 'text-indigo-600 dark:text-indigo-300',
}: {
  title: string;
  children: React.ReactNode;
  titleClass?: string;
}) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
    <h3 className={`text-lg font-semibold mb-4 ${titleClass}`}>{title}</h3>
    {children}
  </div>
);

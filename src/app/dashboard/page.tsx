'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import AddGoalModal from '@/components/AddGoalModal';
import SelfAssessmentModal from '@/components/SelfAssessmentModal';
import {
  extractList,
  normalize as normalizeSelfAssessment,
  SCENARIOS,
  type SelfAssessmentView,
} from '@/utils/selfAssessment';

const BADGE_CATALOG: Record<string, { name: string; image: string }> = {
  // XP Milestone Badges (100-1000 XP)
  xp_explorer: { name: 'XP Explorer', image: '' },
  momentum_builder: { name: 'Momentum Builder', image: '/images/badges/momentum-builder.png' },
  consistent_learner: { name: 'Consistent Learner', image: '/images/badges/consistem-builder.png' },
  dedicated_practitioner: { name: 'Dedicated Practitioner', image: '' },
  halfway_hero: { name: 'Halfway Hero', image: '' },
  strong_commitment: { name: 'Strong Commitment', image: '' },
  excellence_seeker: { name: 'Excellence Seeker', image: '' },
  mastery_approach: { name: 'Mastery Approach', image: '' },
  almost_legendary: { name: 'Almost Legendary', image: '' },
  xp_master: { name: 'XP Master', image: '' },
  
  // High XP Badges (5000+ XP)
  xp_legend: { name: 'XP Legend', image: '' },
  xp_god: { name: 'XP God', image: '' },
  
  // Streak Badges
  streak_master: { name: 'Streak Master', image: '' },
  streak_champion: { name: 'Streak Champion', image: '' },
  streak_legend: { name: 'Streak Legend', image: '' },
  
  // Achievement Badges
  first_steps: { name: 'First Steps', image: '/images/badges/first-steps.png' },
};

const normalizeKey = (s: unknown) =>
  String(s ?? '').trim().toLowerCase().replace(/\s+/g, '_');

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
  const sp = useSearchParams();
  const { refreshProfile } = useAuth();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showSelfAssessment, setShowSelfAssessment] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<SelfAssessmentView | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  // Handle toast messages from URL parameters
  useEffect(() => {
    const toast = sp.get('toast');
    const xpUpdated = sp.get('xp_updated');
    
    if (toast === 'feedback_saved') {
      // Show success message for completed scenario
      Swal.fire({
        title: 'Welcome Back! 🎉',
        text: xpUpdated === 'true' 
          ? 'Great job completing that scenario! Your XP has been updated locally.'
          : 'Great job completing that scenario! Your progress has been saved.',
        icon: 'success',
        confirmButtonColor: '#4F46E5',
        timer: 3000,
        timerProgressBar: true,
      });
      
      // Refresh dashboard data to show updated XP
      const refreshDashboard = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // Add a small delay to ensure backend has processed the XP update
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('[Dashboard] Refreshing data after scenario completion...');
            
            const fresh = await api.get('/user/dashboard', {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            console.log('[Dashboard] Fresh dashboard data:', fresh.data?.data);
            console.log('[Dashboard] Fresh XP value:', fresh.data?.data?.stats?.xp);
            
            setDashboard(fresh.data?.data ?? null);
            
            // Also refresh user profile to ensure XP is updated there too
            await refreshProfile();
            
            console.log('[Dashboard] Refresh complete');
          }
        } catch (error) {
          console.log('Dashboard refresh failed:', error);
        }
      };
      
      refreshDashboard();
      
      // Clean up the URL
      router.replace('/dashboard', { scroll: false });
    }
  }, [sp, router, refreshProfile]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await api.get('/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(res.data?.data ?? null);

        // Debug badge data
        console.log('[Dashboard] Badge data from backend:', {
          userBadges: res.data?.data?.user?.badges,
          statsBadges: res.data?.data?.stats?.badges,
          fullUser: res.data?.data?.user,
          fullStats: res.data?.data?.stats
        });

        const saRes = await api.get('/self-assessment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = extractList(saRes?.data);
        const hasCompleted = list.length > 0;
        localStorage.setItem('selfAssessmentCompleted', hasCompleted ? 'true' : 'false');
        setShowSelfAssessment(!hasCompleted);
        setSelfAssessment(hasCompleted ? normalizeSelfAssessment(list[0]) : null);

        await refreshProfile();
        
        // No need to clean localStorage XP since we're not using it anymore
        
        // Sync backend XP data
        const backendXP = res.data?.data?.stats?.xp || 0;
        if (backendXP > 0) {
          console.log('[Dashboard] Backend XP loaded:', backendXP);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [router, refreshProfile]);

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
    stats = { xp: 0, level: 1, streak: 0, badges: [] as any[] },
    progress = { completedScenariosCount: 0, recentScenarios: [] as string[] },
    messages = [] as string[],
    goals = [] as any[],
  } = dashboard;

  const displayName = user.name || 'User';
  const avatarSrc = user.avatar?.startsWith?.('http') ? user.avatar : '/images/default-avatar.png';

  // Use only backend XP data - no more localStorage fallback
  const xp = Math.max(0, Number(stats.xp || 0));
  
  const level = calculateLevelFromXP(xp);
  const xpForNextLevel = 100;
  const xpIntoLevel = xp % 100;
  const progressPercentage = xpForNextLevel > 0 ? Math.min((xpIntoLevel / xpForNextLevel) * 100, 100) : 0;

  const rawBadges: any[] = Array.isArray(user.badges) ? user.badges : (Array.isArray(stats.badges) ? stats.badges : []);
  
  // Debug badge processing
  console.log('[Dashboard] Badge processing:', {
    userBadges: user.badges,
    statsBadges: stats.badges,
    rawBadges,
    user,
    stats
  });
  
  const badges = rawBadges.map((b) => {
    if (typeof b === 'string') {
      const k = normalizeKey(b);
      const meta = BADGE_CATALOG[k] || { name: b, image: '/images/default-badge.png' };
      return { key: k, name: meta.name, image: meta.image };
    }
    const k = normalizeKey(b.key ?? b.name ?? 'badge');
    const meta = BADGE_CATALOG[k];
    return {
      key: k,
      name: meta?.name ?? (b.name ?? b.key ?? 'Badge'),
      image: meta?.image ?? (b.image ?? '/images/default-badge.png'),
    };
  });
  
  console.log('[Dashboard] Processed badges:', badges);

  const DESIRED_COUNT = 3;
  const recInput = Array.isArray(selfAssessment?.insights?.recommended)
    ? selfAssessment!.insights!.recommended
    : [];
  const wantedSlugs: string[] = recInput
    .map((r: any) => (typeof r === 'string' ? r : r?.slug))
    .filter(Boolean);
  const bySlug = new Map(SCENARIOS.map(s => [s.slug, s]));
  const primary = wantedSlugs
    .map(slug => bySlug.get(slug))
    .filter(Boolean) as Array<{ slug: string; title: string; imageUrl: string; level: string; xp: number }>;
  const picked = new Set(primary.map(s => s.slug));
  const fallbackPool = SCENARIOS.filter(s => !picked.has(s.slug));
  const recommendedCards = [...primary, ...fallbackPool].slice(0, Math.min(DESIRED_COUNT, SCENARIOS.length));

  const deleteGoal = async (goal: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const title = String(goal.title || '').trim();
    let id: string | null = goal._id || goal.id || goal.goalId || null;

    const ok = await Swal.fire({ title: 'Delete goal?', icon: 'warning', showCancelButton: true });
    if (!ok.isConfirmed) return;

    try {
      if (id) {
        await api.delete(`/goals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        const all = await api.get('/goals', { headers: { Authorization: `Bearer ${token}` } });
        const matches = (all.data?.data || []).filter(
          (g: any) => String(g.title || '').toLowerCase() === title.toLowerCase()
        );
        if (!matches.length) {
          await Swal.fire('Oops', 'Goal id not found for deletion.', 'info');
          return;
        }
        await Promise.all(
          matches.map((m: any) =>
            api.delete(`/goals/${m._id}`, { headers: { Authorization: `Bearer ${token}` } })
          )
        );
      }

      const fresh = await api.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      setDashboard(fresh.data?.data ?? null);
    } catch (e) {
      await Swal.fire('Error', 'Could not delete goal.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      {showSelfAssessment && (
        <SelfAssessmentModal
          onSuccess={async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) return;
              
              // Refresh dashboard data to show updated XP
              const fresh = await api.get('/user/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setDashboard(fresh.data?.data ?? null);
              
              // Refresh self-assessment data
              const saRes = await api.get('/self-assessment', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const list = extractList(saRes?.data);
              setShowSelfAssessment(!(list.length > 0));
              setSelfAssessment(list.length ? normalizeSelfAssessment(list[0]) : null);
              
              // Refresh user profile to get updated XP
              await refreshProfile();
            } catch (error) {
              console.error('Failed to refresh dashboard after self-assessment:', error);
            }
          }}
          onClose={() => setShowSelfAssessment(false)}
        />
      )}

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

      <div className="flex justify-center mb-6">
        <Image src="/images/wizard-blob.png" alt="Friendly wizard mascot" width={120} height={120} className="rounded-full shadow-md" />
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="XP" value={xp} />
        <StatCard label="Level" value={`Level ${level}`} />
        <StatCard label="Streak" value={`${stats.streak ?? 0} days`} />
      </div>

      <div id="xp-stats" className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow mb-8">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">XP Progress</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-full">
          <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${progressPercentage}%` }} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {xpIntoLevel}/{xpForNextLevel} XP in this level
        </p>
      </div>

      <Section title="Your Badges" titleClass="text-yellow-600 dark:text-yellow-300">
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {badges.map((badge) => (
              <div
                key={badge.key}
                className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <Image src={badge.image} alt={badge.name} width={60} height={60} className="rounded-full" />
                <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">You haven’t earned any badges yet. Play scenarios to earn some!</p>
        )}
      </Section>

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

      <Section title="Your Goals" titleClass="text-purple-600 dark:text-purple-300">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowAddGoal(true)}
            className="text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + Add goal
          </button>
        </div>

        {Array.isArray(goals) && goals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g: any) => {
              const id = g._id || g.id || g.goalId || null;
              const title = g.title ?? 'Goal';
              const target = Number(g.target ?? 1);
              const progress = Number(g.progress ?? 0);
              const pct = Math.max(0, Math.min(100, target ? (progress / target) * 100 : 0));
              const deadlineISO = g.deadline ?? null;
              const due = deadlineISO ? new Date(deadlineISO).toLocaleDateString() : null;
              const completed = Boolean(g.completed) || progress >= target;

              const increment = async () => {
                if (!id) return;
                try {
                  const token = localStorage.getItem('token');
                  await api.put(
                    `/goals/${id}/progress`,
                    { increment: 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  const fresh = await api.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
                  setDashboard(fresh.data?.data ?? null);
                } catch {
                  await Swal.fire('Error', 'Could not update progress.', 'error');
                }
              };

              const onDelete = () => deleteGoal(g);

              return (
                <div key={id || title} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {due ? `Due ${due}` : 'No deadline'}
                      </div>
                      <h4 className="font-semibold text-indigo-700 dark:text-indigo-200">{title}</h4>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        completed
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200'
                      }`}
                    >
                      {completed ? 'Completed' : 'In progress'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Progress</span>
                      <span>
                        {Math.min(progress, target)} / {target}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {!completed && id && (
                      <button
                        onClick={increment}
                        className="text-xs px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        +1 Attempt
                      </button>
                    )}
                    <button
                      onClick={onDelete}
                      className="text-xs px-3 py-1 rounded-md border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No goals yet. Add them from your Self-Assessment page.</p>
        )}
      </Section>

      <Section title="Recent Scenarios">
        {(progress?.recentScenarios || []).length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {(progress.recentScenarios || []).map((scenario: string, index: number) => (
              <li key={index}>{scenario}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent scenarios. Let's get started.</p>
        )}
      </Section>

      {messages.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-200 p-4 rounded">
          <p className="font-medium">{messages[0]}</p>
        </div>
      )}

      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onSuccess={async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            const fresh = await api.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
            setDashboard(fresh.data?.data ?? null);
          }}
        />
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

function Section({
  title,
  children,
  titleClass = 'text-indigo-600 dark:text-indigo-300',
}: {
  title: string;
  children: React.ReactNode;
  titleClass?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-8">
      <h3 className={`text-lg font-semibold mb-4 ${titleClass}`}>{title}</h3>
      {children}
    </div>
  );
}
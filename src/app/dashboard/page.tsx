'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Image from 'next/image';
import AddGoalModal from '@/components/AddGoalModal';
import SelfAssessmentModal from '@/components/SelfAssessmentModal';
import {
  extractList,
  normalize as normalizeSelfAssessment,
  SCENARIOS,
  type SelfAssessmentView,
} from '@/utils/selfAssessment';
import { motion, AnimatePresence } from 'framer-motion';
import { showNotification } from '@/components/Notification';

const BADGE_CATALOG: Record<string, { name: string; image: string }> = {
  // XP Milestone Badges (100-1000 XP)
  xp_explorer: { name: 'XP Explorer', image: '/images/badges/xp-explorer.png' },
  momentum_builder: { name: 'Momentum Builder', image: '/images/badges/momentum-builder.png' },
  consistent_learner: { name: 'Consistent Learner', image: '/images/badges/consistem-builder.png' },
  dedicated_practitioner: { name: 'Dedicated Practitioner', image: '/images/badges/dedicated-p.png' },
  halfway_hero: { name: 'Halfway Hero', image: '/images/badges/half-way.png' },
  strong_commitment: { name: 'Strong Commitment', image: '/images/badges/xp-explorer.png' },
  excellence_seeker: { name: 'Excellence Seeker', image: '/images/badges/consistem-builder.png' },
  mastery_approach: { name: 'Mastery Approach', image: '/images/badges/momentum-builder.png' },
  almost_legendary: { name: 'Almost Legendary', image: '/images/badges/xp-explorer.png' },
  xp_master: { name: 'XP Master', image: '/images/badges/consistem-builder.png' },
  
  // High XP Badges (5000+ XP)
  xp_legend: { name: 'XP Legend', image: '/images/badges/momentum-builder.png' },
  xp_god: { name: 'XP God', image: '/images/badges/xp-explorer.png' },
  
  // Streak Badges
  streak_master: { name: 'Streak Master', image: '/images/badges/streak-5.png' },
  streak_champion: { name: 'Streak Champion', image: '/images/badges/momentum-builder.png' },
  streak_legend: { name: 'Streak Legend', image: '/images/badges/consistem-builder.png' },
  
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
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const previousBadges = useRef<string[]>([]);
  const [deleteGoalConfirmation, setDeleteGoalConfirmation] = useState<{goalId: string, goalName: string} | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  // Handle toast messages from URL parameters
  useEffect(() => {
    const toast = sp.get('toast');
    const xpUpdated = sp.get('xp_updated');
    
    if (toast === 'feedback_saved') {
      // Refresh dashboard data to show updated XP (no duplicate notification needed)
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

  useEffect(() => {
    if (dashboard && dashboard.stats && dashboard.stats.badges) {
      const currentBadges = dashboard.stats.badges;
      
      console.log('[Dashboard] Badge detection:', {
        currentBadges,
        previousBadges: previousBadges.current,
        currentXP: dashboard.stats.xp
      });
      
      // Check for new badges by comparing with previous badges
      if (previousBadges.current.length > 0) {
        const newBadgeKeys = currentBadges.filter((badge: string) => 
          !previousBadges.current.includes(badge)
        );
        
        console.log('[Dashboard] New badges found:', newBadgeKeys);
        
        if (newBadgeKeys.length > 0) {
          setNewBadges(newBadgeKeys);
          setShowBadgeNotification(true);
          
          console.log('[Dashboard] Badge notification triggered for:', newBadgeKeys);
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowBadgeNotification(false);
          }, 5000);
        }
      } else {
        // First time loading - check if user should have earned badges based on XP
        console.log('[Dashboard] First load - checking XP-based badges');
        const currentXP = dashboard.stats.xp || 0;
        
        // Check what badges should be awarded based on current XP
        const expectedBadges = [];
        if (currentXP >= 100) expectedBadges.push('xp_explorer');
        if (currentXP >= 200) expectedBadges.push('momentum_builder');
        if (currentXP >= 300) expectedBadges.push('consistent_learner');
        if (currentXP >= 400) expectedBadges.push('dedicated_practitioner');
        if (currentXP >= 500) expectedBadges.push('halfway_hero');
        
        console.log('[Dashboard] Expected badges for', currentXP, 'XP:', expectedBadges);
        console.log('[Dashboard] Actual badges from backend:', currentBadges);
        
        // Check for missing badges that should be awarded
        const missingBadges = expectedBadges.filter(badge => !currentBadges.includes(badge));
        if (missingBadges.length > 0) {
          console.log('[Dashboard] Missing badges that should be awarded:', missingBadges);
        }
      }
      
      // Update previous badges for next comparison
      previousBadges.current = currentBadges;
    }
  }, [dashboard]);

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

  const handleDeleteGoal = (goalId: string, goalName: string) => {
    setDeleteGoalConfirmation({ goalId, goalName });
  };

  const confirmDeleteGoal = async () => {
    if (!deleteGoalConfirmation) return;
    
    try {
      const { goalId } = deleteGoalConfirmation;
      await api.delete(`/goals/${goalId}`);
      
      showNotification('success', 'Goal Deleted', 'Your goal has been successfully removed.');
      
      // Refresh dashboard data
      const token = localStorage.getItem('token');
      if (token) {
        const fresh = await api.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        setDashboard(fresh.data?.data ?? null);
      }
    } catch (error: any) {
      let message = 'Could not delete goal. Please try again.';
      if (error.response?.status === 404) {
        message = 'This goal may have already been deleted.';
      }
      
      showNotification('error', 'Delete Failed', message);
    } finally {
      setDeleteGoalConfirmation(null);
    }
  };

  const cancelDeleteGoal = () => {
    setDeleteGoalConfirmation(null);
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await api.put(`/goals/${goalId}/progress`, { progress: newProgress }, { headers: { Authorization: `Bearer ${token}` } });
      
      showNotification('success', 'Progress Updated', 'Your goal progress has been updated successfully.');
      
      // Refresh dashboard data
      const fresh = await api.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      setDashboard(fresh.data?.data ?? null);
    } catch (error) {
      showNotification('error', 'Update Failed', 'Could not update progress. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      {/* Notification Component */}
      {/* Removed Notification component as per edit hint */}
      
      {/* Badge Notification */}
      <AnimatePresence>
        {showBadgeNotification && newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-2xl border-2 border-yellow-300 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏆</div>
              <div>
                <h3 className="font-bold text-lg">New Badge{newBadges.length > 1 ? 's' : ''} Earned!</h3>
                <p className="text-sm opacity-90">
                  {newBadges.length === 1 
                    ? `You earned the "${BADGE_CATALOG[newBadges[0]]?.name || newBadges[0]}" badge!`
                    : `You earned ${newBadges.length} new badges!`
                  }
                </p>
              </div>
            </div>
            
            {/* Show new badges */}
            <div className="mt-3 flex gap-2">
              {newBadges.map((badgeKey) => {
                const badge = BADGE_CATALOG[badgeKey];
                return (
                  <div key={badgeKey} className="flex flex-col items-center bg-white/20 rounded-lg p-2">
                    {badge?.image ? (
                      <Image 
                        src={badge.image} 
                        alt={badge.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">🏅</span>
                      </div>
                    )}
                    <span className="text-xs font-medium mt-1 text-center">
                      {badge?.name || badgeKey}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setShowBadgeNotification(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

        {showSelfAssessment && (
          <SelfAssessmentModal
            onSuccess={async () => {
              setShowSelfAssessment(false);
              await refreshProfile();
              // Refresh dashboard data
              const token = localStorage.getItem('token');
              if (token) {
                const res = await api.get('/user/dashboard', {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setDashboard(res.data?.data ?? null);
              }
            }}
            onClose={() => setShowSelfAssessment(false)}
          />
        )}

        {showAddGoal && (
          <AddGoalModal
            onClose={() => setShowAddGoal(false)}
            onSuccess={() => {
              setShowAddGoal(false);
              // Refresh dashboard data
              const token = localStorage.getItem('token');
              if (token) {
                api.get('/user/dashboard', {
                  headers: { Authorization: `Bearer ${token}` },
                }).then(res => {
                  setDashboard(res.data?.data ?? null);
                });
              }
            }}
          />
        )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-white">
            Hi {displayName}, welcome back
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Here is your current progress.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Admin Panel Link - Only visible to admin users */}
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow transition-colors"
            >
              🛡️ Admin Panel
            </Link>
          )}
          <button
            onClick={handleGoToProfile}
            title="Update your profile"
            className="rounded-full border-4 border-indigo-500 shadow-md hover:scale-105 transition-transform"
          >
            <Image src={avatarSrc} alt="User Avatar" width={90} height={90} className="rounded-full" />
          </button>
        </div>
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
          <p className="text-gray-500 dark:text-gray-400">You haven't earned any badges yet. Play scenarios to earn some!</p>
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
                  showNotification('error', 'Error', 'Could not update progress.');
                }
              };

              const onDelete = () => handleDeleteGoal(id || '', title || '');

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

      <Section title="Recent Scenarios" titleClass="text-green-600 dark:text-green-300">
        {(progress?.recentScenarios || []).length > 0 ? (
          <div className="space-y-3">
            {(progress.recentScenarios || []).map((scenario: any, index: number) => {
              // Handle both string and object formats from backend
              const scenarioData = typeof scenario === 'string' ? { name: scenario } : scenario;
              const scenarioName = scenarioData.name || scenarioData.title || scenarioData.scenarioName || 'Unknown Scenario';
              const completionDate = scenarioData.completedAt ? new Date(scenarioData.completedAt).toLocaleDateString() : null;
              const xpEarned = scenarioData.xpEarned || scenarioData.xp || 0;
              const rating = scenarioData.rating || scenarioData.userRating;
              
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                        {scenarioName}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {completionDate && (
                          <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span>
                            Completed {completionDate}
                          </span>
                        )}
                        {xpEarned > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            +{xpEarned} XP
                          </span>
                        )}
                        {rating && (
                          <span className="flex items-center gap-1">
                            <span className="text-blue-500">💭</span>
                            Rating: {rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {scenarioData.slug && (
                        <Link
                          href={`/scenarios/${scenarioData.slug}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 text-sm font-medium"
                        >
                          Replay →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎯</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No scenarios completed yet</p>
            <p className="text-gray-400 dark:text-gray-300 text-sm">
              Start with your first scenario to see your progress here!
            </p>
            <Link
              href="/scenarios"
              className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Browse Scenarios
            </Link>
          </div>
        )}
      </Section>

      {messages.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-200 p-4 rounded">
          <p className="font-medium">{messages[0]}</p>
        </div>
      )}

      {/* Delete Goal Confirmation Modal */}
      {deleteGoalConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">Delete Goal</h3>
              <div className="mt-2 px-7">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete the goal "{deleteGoalConfirmation.goalName}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={cancelDeleteGoal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteGoal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Goal
                </button>
              </div>
            </div>
          </div>
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
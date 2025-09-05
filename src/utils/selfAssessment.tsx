// ---------- Types ----------
export type Answers = {
  practiceFrequency: string;
  confidenceBefore: number | null;
  confidenceAfter: number | null;
  primaryGoal: string;
  comfortZones: string[];
  preferredScenarios: string[];
  anxietyTriggers: string[];
  socialFrequency: string;
  communicationConfidence: string;
};

export type Insights = {
  confidenceChange: number;
  practiceCadence: string;
  tags: string[];
  suggestions: string[];
  /** Top scenario picks derived from the answers */
  recommended: Array<{ slug: string; title: string }>;
};

export type SelfAssessmentView = {
  _id?: string;
  answers: Answers;
  insights: Insights;
  createdAt?: string;
  updatedAt?: string;
};

// ---------- Labels ----------
export const LABELS: Record<keyof Answers, string> = {
  practiceFrequency: 'Practice frequency',
  confidenceBefore: 'Confidence before',
  confidenceAfter: 'Confidence after',
  primaryGoal: 'Primary goal',
  comfortZones: 'Comfort zones',
  preferredScenarios: 'Preferred scenarios',
  anxietyTriggers: 'Anxiety triggers',
  socialFrequency: 'Social frequency',
  communicationConfidence: 'Communication confidence',
};

// ---------- Catalog (your scenarios) ----------
export const SCENARIOS = [
  { title: 'Intro to SocialEase', level: 'Beginner', xp: 10, imageUrl: '/images/scenarios/intro.png', slug: 'intro-to-socialease' },
  { title: 'Order at a Cafe', level: 'Beginner', xp: 20, imageUrl: '/images/scenarios/cafe.png', slug: 'order-at-a-cafe' },
  { title: 'Greet a Stranger', level: 'Beginner', xp: 20, imageUrl: '/images/scenarios/stranger.png', slug: 'greet-a-stranger' },
  { title: 'Say No Politely', level: 'Beginner', xp: 25, imageUrl: '/images/scenarios/say-no.png', slug: 'say-no-politely' },
  { title: 'Start Small Talk', level: 'Beginner', xp: 25, imageUrl: '/images/scenarios/smalltalk.png', slug: 'start-small-talk' },
  { title: 'Join Group Conversation', level: 'Beginner', xp: 30, imageUrl: '/images/scenarios/group.png', isVR: true, slug: 'join-group-conversation' },
  { title: 'Talk to a Co-worker', level: 'Intermediate', xp: 30, imageUrl: '/images/scenarios/coworker.png', slug: 'talk-to-a-coworker' },
  { title: 'Give a Compliment', level: 'Intermediate', xp: 30, imageUrl: '/images/scenarios/compliment.png', slug: 'give-a-compliment' },
  { title: 'Ask for Help in Public', level: 'Intermediate', xp: 30, imageUrl: '/images/scenarios/ask-help.png', isVR: true, slug: 'ask-for-help-in-public' },
  { title: 'Speak Up in a Group', level: 'Intermediate', xp: 30, imageUrl: '/images/scenarios/speak-up.png', slug: 'speak-up-in-a-group' },
  { title: 'Make a Phone Call', level: 'Advanced', xp: 35, imageUrl: '/images/scenarios/phone.png', slug: 'make-a-phone-call' },
  { title: 'Handle Criticism', level: 'Advanced', xp: 35, imageUrl: '/images/scenarios/criticism.png', slug: 'handle-criticism' },
  { title: 'Disagree Respectfully', level: 'Advanced', xp: 40, imageUrl: '/images/scenarios/disagree.png', slug: 'disagree-respectfully' },
  { title: 'Mock Interview', level: 'Advanced', xp: 45, imageUrl: '/images/scenarios/interview.png', isVR: true, slug: 'mock-interview' },
  { title: 'Attend a Networking Event', level: 'Advanced', xp: 45, imageUrl: '/images/scenarios/networking.png', isVR: true, slug: 'attend-a-networking-event' },
];

// ---------- API helper ----------
export function extractList(respJson: any) {
  const d = respJson?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (d) return [d];
  return [];
}

// ---------- Recommender ----------
function recommendScenarios(a: Answers, max = 3): Array<{ slug: string; title: string }> {
  const pref = (a.preferredScenarios || []).map(s => String(s).toLowerCase());
  const trig = (a.anxietyTriggers || []).map(s => String(s).toLowerCase());
  const goal = String(a.primaryGoal || '').toLowerCase();
  const freq = String(a.socialFrequency || '').toLowerCase();

  const scores: Record<string, number> = Object.fromEntries(SCENARIOS.map(s => [s.slug, 0]));

  // cadence
  if (freq.includes('rare') || freq.includes('never') || freq.includes('month')) {
    scores['intro-to-socialease'] += 3;
    scores['greet-a-stranger'] += 2;
    scores['order-at-a-cafe'] += 2;
  } else if (freq.includes('week')) {
    scores['start-small-talk'] += 2;
    scores['join-group-conversation'] += 1;
  } else if (freq.includes('day')) {
    scores['start-small-talk'] += 2;
  }

  // preferences
  if (pref.includes('group conversations')) {
    scores['join-group-conversation'] += 4;
    scores['speak-up-in-a-group'] += 3;
    scores['attend-a-networking-event'] += 2;
  }
  if (pref.includes('one-on-one')) {
    scores['greet-a-stranger'] += 3;
    scores['start-small-talk'] += 2;
    scores['give-a-compliment'] += 2;
  }
  if (pref.includes('public speaking')) {
    scores['speak-up-in-a-group'] += 4;
    scores['attend-a-networking-event'] += 3;
    scores['mock-interview'] += 2;
  }

  // triggers
  if (trig.includes('crowds')) {
    scores['join-group-conversation'] += 2;
    scores['attend-a-networking-event'] += 2;
  }
  if (trig.includes('rejection')) {
    scores['say-no-politely'] += 3;
    scores['handle-criticism'] += 2;
  }
  if (trig.includes('judgment')) {
    scores['give-a-compliment'] += 2;
    scores['speak-up-in-a-group'] += 2;
  }

  // goals
  if (goal.includes('confidence')) {
    scores['greet-a-stranger'] += 2;
    scores['start-small-talk'] += 2;
  }
  if (goal.includes('professional')) {
    scores['talk-to-a-coworker'] += 3;
    scores['mock-interview'] += 3;
    scores['attend-a-networking-event'] += 2;
  }
  if (goal.includes('friendship')) {
    scores['start-small-talk'] += 3;
    scores['join-group-conversation'] += 2;
  }

  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, max)
    .map(([slug]) => {
      const scenario = SCENARIOS.find(s => s.slug === slug);
      return { slug, title: scenario?.title || slug };
    });

  return sorted;
}

// ---------- Normalization ----------
export function normalize(data: any): SelfAssessmentView {
  // Handle both nested and flat data structures
  let answers, insights;
  
  if (data.answers && data.insights) {
    // Nested structure (what frontend expects)
    answers = data.answers;
    insights = data.insights;
  } else {
    // Flat structure (what backend returns)
    answers = {
      confidenceBefore: data.confidenceBefore,
      confidenceAfter: data.confidenceAfter,
      primaryGoal: data.primaryGoal,
      comfortZones: data.comfortZones,
      preferredScenarios: data.preferredScenarios,
      anxietyTriggers: data.anxietyTriggers,
      socialFrequency: data.socialFrequency || data.socialLevel, // Handle both field names
      communicationConfidence: data.communicationConfidence,
      practiceFrequency: data.practiceFrequency
    };
    insights = {
      confidenceChange: 0, // Will be calculated below
      practiceCadence: 'flexible', // Will be calculated below
      tags: [], // Will be calculated below
      suggestions: [], // Will be calculated below
      recommended: [] // Will be calculated below
    };
  }

  // Calculate confidence change
  const before = answers.confidenceBefore || 0;
  const after = answers.confidenceAfter || 0;
  const confidenceChange = after - before;

  // Generate practice cadence
  const freq = String(answers.practiceFrequency || '').toLowerCase();
  let practiceCadence = 'flexible';
  if (freq.includes('daily')) practiceCadence = 'daily';
  else if (freq.includes('weekly')) practiceCadence = 'weekly';
  else if (freq.includes('monthly')) practiceCadence = 'monthly';

  // Generate tags
  const tags: string[] = [];
  if (confidenceChange > 0) tags.push('confidence-boost');
  if (confidenceChange < 0) tags.push('confidence-drop');
  if (answers.comfortZones?.length) tags.push('comfort-zone-aware');
  if (answers.anxietyTriggers?.length) tags.push('trigger-aware');

  // Generate suggestions
  const suggestions: string[] = [];
  if (confidenceChange < 0) {
    suggestions.push('Consider starting with easier scenarios to rebuild confidence');
  }
  if (answers.anxietyTriggers?.length) {
    suggestions.push('Practice scenarios that gradually expose you to your triggers');
  }
  if (answers.comfortZones?.length) {
    suggestions.push('Leverage your comfort zones as a foundation for growth');
  }

  // Get recommended scenarios
  const recommended = recommendScenarios(answers, 3);

  return {
    _id: data._id,
    answers,
    insights: {
      ...insights,
      confidenceChange,
      practiceCadence,
      tags,
      suggestions,
      recommended,
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
  
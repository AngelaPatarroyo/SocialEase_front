// src/utils/selfAssessment.ts

// ---------- Types ----------
export type Answers = {
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
    confidenceBefore: 'Confidence before',
    confidenceAfter: 'Confidence after',
    primaryGoal: 'Primary goal',
    comfortZones: 'Comfort zones',
    preferredScenarios: 'Preferred scenarios',
    anxietyTriggers: 'Anxiety triggers',
    socialFrequency: 'Practice frequency',
    communicationConfidence: 'Communication confidence',
  };
  
  // ---------- API helper ----------
  export function extractList(respJson: any) {
    const d = respJson?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (d) return [d];
    return [];
  }
  
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
    if (pref.includes('dating')) {
      scores['greet-a-stranger'] += 2;
      scores['start-small-talk'] += 3;
      scores['give-a-compliment'] += 2;
      scores['attend-a-networking-event'] += 1;
    }
  
    // goals
    if (goal.includes('small talk')) {
      scores['start-small-talk'] += 4;
      scores['greet-a-stranger'] += 2;
      scores['order-at-a-cafe'] += 1;
      scores['attend-a-networking-event'] += 2;
    }
    if (goal.includes('say no') || goal.includes('boundar')) {
      scores['say-no-politely'] += 4;
      scores['disagree-respectfully'] += 2;
    }
    if (goal.includes('work') || goal.includes('coworker') || goal.includes('colleague')) {
      scores['talk-to-a-coworker'] += 3;
      scores['handle-criticism'] += 2;
      scores['disagree-respectfully'] += 2;
    }
    if (goal.includes('ask for help') || goal.includes('public help')) {
      scores['ask-for-help-in-public'] += 3;
    }
    if (goal.includes('phone') || goal.includes('call')) {
      scores['make-a-phone-call'] += 4;
    }
    if (goal.includes('interview')) {
      scores['mock-interview'] += 4;
    }
    if (goal.includes('network')) {
      scores['attend-a-networking-event'] += 4;
    }
  
    // triggers
    if (trig.some(t => ['being watched', 'spotlight', 'attention'].includes(t))) {
      scores['mock-interview'] += 2;
      scores['speak-up-in-a-group'] += 2;
    }
    if (trig.some(t => t.includes('silence'))) {
      scores['start-small-talk'] += 2;
      scores['greet-a-stranger'] += 1;
    }
    if (trig.some(t => t.includes('phone'))) {
      scores['make-a-phone-call'] += 3;
    }
    if (trig.some(t => t.includes('conflict') || t.includes('criticism'))) {
      scores['handle-criticism'] += 3;
      scores['disagree-respectfully'] += 2;
    }
  
    const ranked = [...SCENARIOS]
      .map(s => ({ ...s, score: scores[s.slug] }))
      .sort((a, b) => b.score - a.score || a.xp - b.xp);
  
    return ranked
      .filter(r => r.score > 0)
      .slice(0, max)
      .map(r => ({ slug: r.slug, title: r.title }));
  }
  
  // ---------- Insights ----------
  export function buildInsights(a: Answers): Insights {
    const before = Number(a.confidenceBefore ?? 0);
    const after  = Number(a.confidenceAfter ?? 0);
    const delta  = after - before;
  
    const pref = (a.preferredScenarios || []).map(s => String(s).toLowerCase());
    const trig = (a.anxietyTriggers   || []).map(s => String(s).toLowerCase());
    const freq = String(a.socialFrequency || '').toLowerCase();
    const goal = String(a.primaryGoal || '').toLowerCase();
  
    const suggestions: string[] = [];
    const add = (s: string) => { if (!suggestions.includes(s)) suggestions.push(s); };
  
    // cadence
    if (freq.includes('rare') || freq.includes('never') || freq.includes('month'))
      add('Schedule one short practice this week (5–10 min).');
    else if (freq.includes('week'))
      add('Do two short practice sessions this week (5–10 min).');
    else if (freq.includes('day'))
      add('Do one quick daily practice (2–5 min).');
  
    // triggers
    if (trig.some(t => t.includes('silence')))
      add('Prepare three openers to handle short pauses.');
    if (trig.some(t => ['being watched','spotlight','attention'].includes(t)))
      add('Use a “focus switch”: put attention on the topic; try 2–3 second eye-contact intervals.');
    if (trig.some(t => t.includes('eye contact')))
      add('Practice the eye-contact ladder: glance → 2–3 sec hold → glance away.');
  
    // preferences / goals
    if (pref.includes('group conversations'))
      add('Warm up with a 1:1 chat, then a 3–4 person chat.');
    if (pref.includes('dating'))
      add('Practice 2–3 light openers and one follow-up for a low-pressure setting.');
    if (goal.includes('small talk'))
      add('Prepare 3 go-to small-talk topics with simple follow-up questions.');
  
    // progress
    if (delta > 0) add('Repeat what worked last time.');
    else if (delta < 0) add('Try a smaller, easier step next time.');
    else add('Test one tiny change next time e.g., ask one extra question.');
  
    // reflection
    add('After each practice, note one thing that went well and one tweak for next time.');
  
    const tags: string[] = [];
    if (delta > 0) tags.push('ProgressUp');
    else if (delta < 0) tags.push('ToughSession');
    if (pref.includes('group conversations')) tags.push('GroupConversations');
  
    // attach scenario recommendations
    const recommended = recommendScenarios(a, 3);
  
    return {
      confidenceChange: delta,
      practiceCadence: a.socialFrequency || 'Unspecified',
      tags,
      suggestions,
      recommended,
    };
  }
  
  // ---------- Normalizer ----------
  export function normalize(doc: any): SelfAssessmentView {
    const pick = (k: string, d: any) => (doc?.[k] ?? doc?.answers?.[k] ?? d);
    const answers: Answers = {
      confidenceBefore: Number.isFinite(Number(pick('confidenceBefore', null))) ? Number(pick('confidenceBefore', null)) : null,
      confidenceAfter:  Number.isFinite(Number(pick('confidenceAfter',  null))) ? Number(pick('confidenceAfter',  null)) : null,
      primaryGoal: String(pick('primaryGoal', '') || ''),
      comfortZones: Array.isArray(pick('comfortZones', [])) ? pick('comfortZones', []) : [],
      preferredScenarios: Array.isArray(pick('preferredScenarios', [])) ? pick('preferredScenarios', []) : [],
      anxietyTriggers: Array.isArray(pick('anxietyTriggers', [])) ? pick('anxietyTriggers', []) : [],
      socialFrequency: String(pick('socialFrequency', '') || ''),
      communicationConfidence: String(pick('communicationConfidence', '') || ''),
    };
    return {
      _id: doc?._id,
      answers,
      insights: buildInsights(answers),
      createdAt: doc?.createdAt,
      updatedAt: doc?.updatedAt,
    };
  }
  
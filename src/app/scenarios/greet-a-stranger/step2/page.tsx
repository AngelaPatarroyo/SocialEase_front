'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// ===== Scenario identifier (use slug) =====
const SCENARIO_SLUG = 'greet-a-stranger';

// ===== Script =====
const dialogue = [
  {
    prompt: 'You approach a stranger near the coffee machine...',
    responses: [
      { label: 'Smile and say hello', reply: 'They smile warmly and nod back.' },
      { label: 'Glance and look away', reply: 'They seem unsure and look down.' },
      { label: 'Give a quick wave', reply: 'They wave back with a small smile.' },
    ],
  },
  {
    prompt: 'Stranger: “Hi there! Waiting long?”',
    responses: [
      { label: '“Not really, just got here.”', reply: 'They chuckle: “Lucky timing then.”' },
      { label: '“Yeah, it’s been a while.”', reply: 'They nod: “This machine’s always slow.”' },
      { label: '“I’m just here for water.”', reply: 'They smile politely and look away briefly.' },
    ],
  },
  {
    prompt: 'Stranger: “I haven’t seen you around before?”',
    responses: [
      { label: '“I’m new here!”', reply: 'They smile: “Welcome!”' },
      { label: '“I usually keep to myself.”', reply: 'They nod understandingly.' },
      { label: '“Just visiting a friend.”', reply: 'They say: “Ah, that makes sense.”' },
    ],
  },
  {
    prompt: 'Stranger: “Well, I’m Sam by the way.”',
    responses: [
      { label: '“Nice to meet you, I’m Alex.”', reply: 'Sam says: “Nice to meet you too!”' },
      { label: '“Cool, I’m just heading out.”', reply: 'Sam says: “Catch you later then.”' },
      { label: '“Oh, I’m… uh...”', reply: 'Sam waits patiently.' },
    ],
  },
  {
    prompt: 'Sam smiles: “Wanna grab a coffee sometime?”',
    responses: [
      { label: '“Sure, that sounds great!”', reply: 'Sam grins: “Awesome, looking forward to it.”' },
      { label: '“Maybe another time.”', reply: 'Sam nods: “No pressure.”' },
      { label: '“I’m not sure…”', reply: 'Sam replies: “Totally fine.”' },
    ],
  },
  {
    prompt: 'Sam: “Hope we chat again soon.”',
    responses: [
      { label: '“Definitely.”', reply: 'Sam smiles genuinely.' },
      { label: '“Yeah, maybe.”', reply: 'Sam nods, slightly unsure.' },
      { label: '“We’ll see.”', reply: 'Sam says: “Alright, take care!”' },
    ],
  },
] as const;

// ===== Audio maps =====
const voiceMap: Record<number, string> = {
  0: '/audio/intro.mp3',
  1: '/audio/hi-there.mp3',
  2: '/audio/seen-you.mp3',
  3: '/audio/sam.mp3',
  4: '/audio/coffee.mp3',
  5: '/audio/chat-again.mp3',
};

const replyVoiceMap: Record<string, string> = {
  '1-0': '/audio/lucky-timing.mp3',
  '1-1': '/audio/machine-slow.mp3',
  '1-2': '',

  '2-0': '/audio/welcome.mp3',
  '2-1': '',
  '2-2': '/audio/makes-sense.mp3',

  '3-0': '/audio/nice-to-meet-you.mp3',
  '3-1': '/audio/catch-you-later.mp3',
  '3-2': '',

  '4-0': '/audio/awesome-looking-forward.mp3',
  '4-1': '/audio/no-pressure.mp3',
  '4-2': '/audio/totally-fine.mp3',

  '5-0': '',
  '5-1': '',
  '5-2': '/audio/take-care.mp3',
};

// ===== Timing knobs =====
const PRE_PROMPT_DELAY_MS = 600;   // pause before each prompt voice
const PRE_REPLY_DELAY_MS  = 1200;  // pause before reply voice (user reads first)
const POST_REPLY_EXTRA_MS = 600;   // extra pause after reply audio
const MAX_REPLY_FALLBACK  = 2600;  // fallback max wait if audio has no duration

export default function Step2Conversation() {
  const [turn, setTurn] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const router = useRouter();

  // Audio refs
  const cafeAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceRef = useRef<HTMLAudioElement | null>(null);

  // Ambient café loop
  useEffect(() => {
    const cafeAudio = new Audio('/audio/cafe-ambience.mp3');
    cafeAudio.loop = true;
    cafeAudio.volume = 0.25;
    cafeAudioRef.current = cafeAudio;
    cafeAudio.play().catch(() => {});
    return () => {
      try {
        cafeAudio.pause();
        cafeAudio.currentTime = 0;
      } catch {}
    };
  }, []);

  // Helpers
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const stopCurrentVoice = () => {
    const cur = currentVoiceRef.current;
    if (cur) {
      try {
        cur.pause();
        cur.currentTime = 0;
      } catch {}
      currentVoiceRef.current = null;
    }
  };

  const playVoice = (src: string, fallbackMs = MAX_REPLY_FALLBACK) =>
    new Promise<void>((resolve) => {
      if (!src) return setTimeout(resolve, fallbackMs);

      stopCurrentVoice();

      const a = new Audio(src);
      a.volume = 1;
      currentVoiceRef.current = a;

      const cleanup = () => {
        a.removeEventListener('ended', onEnd);
        a.removeEventListener('error', onErr);
        if (currentVoiceRef.current === a) currentVoiceRef.current = null;
      };
      const onEnd = () => { cleanup(); resolve(); };
      const onErr = () => { cleanup(); setTimeout(resolve, fallbackMs); };

      a.addEventListener('ended', onEnd);
      a.addEventListener('error', onErr);
      a.play().catch(() => { cleanup(); setTimeout(resolve, fallbackMs); });
    });

  // Play prompt voice when a new prompt appears
  useEffect(() => {
    let canceled = false;
    (async () => {
      const promptSrc = voiceMap[turn];
      await delay(PRE_PROMPT_DELAY_MS);
      if (!canceled && promptSrc) await playVoice(promptSrc, 1800);
    })();
    return () => {
      canceled = true;
      stopCurrentVoice();
    };
  }, [turn]);

  // Handle user choice
  const handleChoice = async (idx: number) => {
    if (isBusy || choice !== null) return;
    setIsBusy(true);
    setChoice(idx);

    const replyKey = `${turn}-${idx}`;
    const replySrc = replyVoiceMap[replyKey] || '';

    await delay(PRE_REPLY_DELAY_MS);
    await playVoice(replySrc, MAX_REPLY_FALLBACK);
    await delay(POST_REPLY_EXTRA_MS);

    if (turn < dialogue.length - 1) {
      setTurn((t) => t + 1);
      setChoice(null);
      setIsBusy(false);
    } else {
      // Finish: stop audio then go to Step 3 with the slug
      try {
        stopCurrentVoice();
        if (cafeAudioRef.current) {
          cafeAudioRef.current.pause();
          cafeAudioRef.current.currentTime = 0;
        }
      } catch {}

      const goodbye = new Audio('/audio/goodbye.mp3');
      goodbye.volume = 0.8;
      goodbye.play().catch(() => {});

      // IMPORTANT: pass the slug, not an ObjectId placeholder
      router.push(`/scenarios/greet-a-stranger/step3?scenario=${encodeURIComponent(SCENARIO_SLUG)}`);
    }
  };

  return (
    <main
      className="min-h-screen flex items-end justify-center px-4 py-10 bg-cover bg-top bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/images/backgrounds/greet-room.png')",
        backgroundPosition: 'top center',
      }}
    >
      <div className="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-indigo-100 px-8 py-10 space-y-6 mb-20 transition-all duration-300">
        <motion.h2
          key={turn}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl md:text-2xl text-indigo-900 font-semibold text-center"
        >
          {dialogue[turn].prompt}
        </motion.h2>

        {choice === null ? (
          <div className="space-y-4">
            {dialogue[turn].responses.map((r, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                disabled={isBusy}
                className="w-full py-3 px-5 border border-indigo-300 rounded-xl bg-white hover:bg-indigo-100 disabled:opacity-60 text-indigo-800 text-left font-medium transition shadow-sm"
              >
                {r.label}
              </button>
            ))}
          </div>
        ) : (
          <motion.div
            key={`${turn}-${choice}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-indigo-800 text-base italic"
          >
            {dialogue[turn].responses[choice].reply}
          </motion.div>
        )}
      </div>
    </main>
  );
}

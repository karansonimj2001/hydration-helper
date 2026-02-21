// Mascot state machine & dialogue system for "Droppy" the water droplet

export type MascotState = 'idle' | 'encouraging' | 'thirsty' | 'celebrating' | 'sleeping' | 'greeting';

export interface MascotDialogue {
  state: MascotState;
  messages: string[];
}

const DIALOGUES: MascotDialogue[] = [
  {
    state: 'greeting',
    messages: [
      "Good morning! Ready to hydrate? 💧",
      "Hey there! Let's make today a great hydration day!",
      "Welcome back! I missed you! 🤗",
      "Rise and shine! Your body needs water!",
      "Hello friend! Let's crush that goal today! 💪",
    ],
  },
  {
    state: 'idle',
    messages: [
      "I'm here whenever you need a sip!",
      "Staying hydrated keeps you sharp! 🧠",
      "Did you know water boosts your energy?",
      "Fun fact: your brain is 75% water!",
      "Just chilling here… like cool water! 😎",
    ],
  },
  {
    state: 'encouraging',
    messages: [
      "You're doing great, keep it up! 🌟",
      "Halfway there — you've got this!",
      "Every sip counts! I believe in you!",
      "You're on fire! Well… hydrated fire! 🔥💧",
      "Amazing progress! Don't stop now!",
      "I'm so proud of you! Keep sipping!",
    ],
  },
  {
    state: 'thirsty',
    messages: [
      "I'm getting a little parched… 🥺",
      "Psst! It's been a while since your last drink!",
      "Help! I'm drying up over here! 😰",
      "Your body is thirsty — let's fix that!",
      "I'm thirsty for your success! Take a sip!",
      "Don't leave me hanging… grab some water! 💦",
    ],
  },
  {
    state: 'celebrating',
    messages: [
      "WOOHOO! You hit your goal! 🎉🎊",
      "You did it! I'm doing my happy dance! 💃",
      "AMAZING! You're a hydration champion! 🏆",
      "Goal CRUSHED! You're unstoppable! 🚀",
      "Party time! You're properly hydrated! 🥳",
      "I knew you could do it! SO PROUD! 🌈",
    ],
  },
  {
    state: 'sleeping',
    messages: [
      "Zzz… sweet dreams… 💤",
      "Shh… resting up for tomorrow… 🌙",
      "Good night! We'll hydrate tomorrow! 😴",
    ],
  },
];

// Pick a random message for a given state
export function getMascotMessage(state: MascotState): string {
  const dialogue = DIALOGUES.find(d => d.state === state);
  if (!dialogue) return "Stay hydrated! 💧";
  return dialogue.messages[Math.floor(Math.random() * dialogue.messages.length)];
}

// Determine mascot state from context
export function determineMascotState(params: {
  percent: number;
  lastEntryMinutesAgo: number | null;
  hour: number;
  bedtimeStart: number; // hour
  bedtimeEnd: number;   // hour
  justLogged: boolean;
  isFirstVisit: boolean;
}): MascotState {
  const { percent, lastEntryMinutesAgo, hour, bedtimeStart, bedtimeEnd, justLogged, isFirstVisit } = params;

  // Bedtime check
  const isBedtime = bedtimeStart > bedtimeEnd
    ? hour >= bedtimeStart || hour < bedtimeEnd
    : hour >= bedtimeStart && hour < bedtimeEnd;

  if (isBedtime) return 'sleeping';
  if (justLogged && percent >= 100) return 'celebrating';
  if (percent >= 100) return 'celebrating';
  if (isFirstVisit) return 'greeting';
  if (justLogged) return 'encouraging';
  if (lastEntryMinutesAgo !== null && lastEntryMinutesAgo > 90) return 'thirsty';
  if (percent >= 50) return 'encouraging';
  if (percent >= 25) return 'idle';
  if (lastEntryMinutesAgo !== null && lastEntryMinutesAgo > 45) return 'thirsty';

  return 'idle';
}

// Mascot expressions/colors per state
export const MASCOT_CONFIG: Record<MascotState, {
  eyeStyle: 'open' | 'happy' | 'sad' | 'closed' | 'sparkle';
  mouthStyle: 'smile' | 'grin' | 'worried' | 'open-smile' | 'sleeping';
  bodyBounce: boolean;
  blush: boolean;
  accessory?: string; // emoji shown near mascot
}> = {
  idle: { eyeStyle: 'open', mouthStyle: 'smile', bodyBounce: false, blush: false },
  greeting: { eyeStyle: 'sparkle', mouthStyle: 'grin', bodyBounce: true, blush: true, accessory: '👋' },
  encouraging: { eyeStyle: 'happy', mouthStyle: 'grin', bodyBounce: true, blush: true, accessory: '⭐' },
  thirsty: { eyeStyle: 'sad', mouthStyle: 'worried', bodyBounce: false, blush: false, accessory: '💦' },
  celebrating: { eyeStyle: 'sparkle', mouthStyle: 'open-smile', bodyBounce: true, blush: true, accessory: '🎉' },
  sleeping: { eyeStyle: 'closed', mouthStyle: 'sleeping', bodyBounce: false, blush: true, accessory: '💤' },
};

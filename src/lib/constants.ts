export const BRAND = {
  name: "SunSpark English",
  teacher: "Miss Gali",
  whatsapp: process.env.WHATSAPP_NUMBER || "50245873127",
  whatsappDisplay: "+502 4587-3127",
  priceGtq: 75,
  sessionMinutes: 55,
  timezone: "America/Guatemala",
  screenLimitMinutes: 45,
  creditExpiryDays: 60,
  cancelCreditHours: 24,
} as const;

/** Class start hours Mon–Fri (2 PM–6 PM Guatemala) */
export const CLASS_HOURS = [14, 15, 16, 17, 18] as const;

export const AGE_BANDS = [
  { id: "BAND_6_8" as const, label: "6–8", min: 6, max: 8 },
  { id: "BAND_9_11" as const, label: "9–11", min: 9, max: 11 },
  { id: "BAND_12_14" as const, label: "12–14", min: 12, max: 14 },
  { id: "BAND_15_17" as const, label: "15–17", min: 15, max: 17 },
];

export function ageToBand(age: number) {
  const band = AGE_BANDS.find((b) => age >= b.min && age <= b.max);
  return band?.id ?? null;
}

export function formatHour(hour: number) {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
}

export const BANK = {
  name: process.env.BANK_NAME || "Banco Industrial",
  accountName: process.env.BANK_ACCOUNT_NAME || "SunSpark English / Miss Gali",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || "000-000000-0",
  type: process.env.BANK_TYPE || "Monetaria",
};

export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "fergie0a04@gmail.com"
).toLowerCase();

export function whatsappLink(text?: string) {
  const n = BRAND.whatsapp.replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${n}${q}`;
}

/** 10 game slots per age band — first 3 playable in MVP */
export const GAMES_BY_BAND: Record<
  string,
  { slug: string; title: string; playable: boolean; type?: "memory" | "phonics" | "listen" }[]
> = {
  BAND_6_8: [
    { slug: "memory-animals", title: "Animal Memory", playable: true, type: "memory" },
    { slug: "phonics-abc", title: "Phonics ABC", playable: true, type: "phonics" },
    { slug: "listen-tap-colors", title: "Listen & Tap Colors", playable: true, type: "listen" },
    { slug: "sunny-farm", title: "Sunny's Farm", playable: false },
    { slug: "word-bubbles", title: "Word Bubbles", playable: false },
    { slug: "hello-song", title: "Hello Song Match", playable: false },
    { slug: "fruit-basket", title: "Fruit Basket", playable: false },
    { slug: "shape-party", title: "Shape Party", playable: false },
    { slug: "body-parts", title: "Body Parts Fun", playable: false },
    { slug: "feelings", title: "Feelings Friends", playable: false },
  ],
  BAND_9_11: [
    { slug: "memory-school", title: "School Memory", playable: true, type: "memory" },
    { slug: "phonics-blends", title: "Phonics Blends", playable: true, type: "phonics" },
    { slug: "listen-tap-actions", title: "Listen & Tap Actions", playable: true, type: "listen" },
    { slug: "story-tiles", title: "Story Tiles", playable: false },
    { slug: "vocab-race", title: "Vocab Race", playable: false },
    { slug: "opposites", title: "Opposites Quest", playable: false },
    { slug: "weather-watch", title: "Weather Watch", playable: false },
    { slug: "days-week", title: "Days of the Week", playable: false },
    { slug: "food-market", title: "Food Market", playable: false },
    { slug: "sunny-quiz", title: "Sunny Quiz", playable: false },
  ],
  BAND_12_14: [
    { slug: "memory-travel", title: "Travel Memory", playable: true, type: "memory" },
    { slug: "phonics-silent", title: "Silent Letters", playable: true, type: "phonics" },
    { slug: "listen-tap-phrases", title: "Listen & Tap Phrases", playable: true, type: "listen" },
    { slug: "dialogue-builder", title: "Dialogue Builder", playable: false },
    { slug: "idiom-lab", title: "Idiom Lab", playable: false },
    { slug: "tense-time", title: "Tense Time", playable: false },
    { slug: "news-bits", title: "News Bits", playable: false },
    { slug: "debate-lite", title: "Debate Lite", playable: false },
    { slug: "vocab-level-up", title: "Vocab Level Up", playable: false },
    { slug: "sunny-challenge", title: "Sunny Challenge", playable: false },
  ],
  BAND_15_17: [
    { slug: "memory-careers", title: "Careers Memory", playable: true, type: "memory" },
    { slug: "phonics-stress", title: "Word Stress", playable: true, type: "phonics" },
    { slug: "listen-tap-news", title: "Listen & Tap News", playable: true, type: "listen" },
    { slug: "essay-spark", title: "Essay Spark", playable: false },
    { slug: "interview-prep", title: "Interview Prep", playable: false },
    { slug: "debate-pro", title: "Debate Pro", playable: false },
    { slug: "media-lit", title: "Media Literacy", playable: false },
    { slug: "academic-vocab", title: "Academic Vocab", playable: false },
    { slug: "real-talk", title: "Real Talk", playable: false },
    { slug: "capstone-quiz", title: "Capstone Quiz", playable: false },
  ],
};

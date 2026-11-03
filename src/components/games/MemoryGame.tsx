"use client";

import { useMemo, useState } from "react";

type Card = { id: number; word: string; emoji: string; flipped: boolean; matched: boolean };

const DECKS: Record<string, { word: string; emoji: string }[]> = {
  animals: [
    { word: "cat", emoji: "🐱" },
    { word: "dog", emoji: "🐶" },
    { word: "bird", emoji: "🐦" },
    { word: "fish", emoji: "🐟" },
    { word: "frog", emoji: "🐸" },
    { word: "bear", emoji: "🐻" },
  ],
  school: [
    { word: "book", emoji: "📚" },
    { word: "pencil", emoji: "✏️" },
    { word: "bag", emoji: "🎒" },
    { word: "desk", emoji: "🪑" },
    { word: "ruler", emoji: "📏" },
    { word: "globe", emoji: "🌍" },
  ],
  travel: [
    { word: "plane", emoji: "✈️" },
    { word: "train", emoji: "🚆" },
    { word: "map", emoji: "🗺️" },
    { word: "hotel", emoji: "🏨" },
    { word: "ticket", emoji: "🎫" },
    { word: "passport", emoji: "🛂" },
  ],
  careers: [
    { word: "doctor", emoji: "🩺" },
    { word: "chef", emoji: "👨‍🍳" },
    { word: "pilot", emoji: "👩‍✈️" },
    { word: "artist", emoji: "🎨" },
    { word: "engineer", emoji: "🛠️" },
    { word: "teacher", emoji: "👩‍🏫" },
  ],
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryGame({
  theme,
  onWin,
}: {
  theme: keyof typeof DECKS;
  onWin: (stars: number) => void;
}) {
  const pairs = DECKS[theme] || DECKS.animals;
  const initial = useMemo(() => {
    const doubled = pairs.flatMap((p, i) => [
      { id: i * 2, ...p, flipped: false, matched: false },
      { id: i * 2 + 1, ...p, flipped: false, matched: false },
    ]);
    return shuffle(doubled);
  }, [pairs]);

  const [cards, setCards] = useState<Card[]>(initial);
  const [picked, setPicked] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);

  function flip(id: number) {
    if (lock || done) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (picked.length >= 2) return;

    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const nextPicked = [...picked, id];
    setCards(next);
    setPicked(nextPicked);

    if (nextPicked.length === 2) {
      setLock(true);
      const [a, b] = nextPicked.map((pid) => next.find((c) => c.id === pid)!);
      if (a.word === b.word) {
        setTimeout(() => {
          setCards((cur) => {
            const updated = cur.map((c) =>
              c.word === a.word ? { ...c, matched: true } : c
            );
            if (updated.every((c) => c.matched)) {
              setDone(true);
              onWin(3);
            }
            return updated;
          });
          setPicked([]);
          setLock(false);
        }, 350);
      } else {
        setTimeout(() => {
          setCards((cur) =>
            cur.map((c) =>
              nextPicked.includes(c.id) ? { ...c, flipped: false } : c
            )
          );
          setPicked([]);
          setLock(false);
        }, 700);
      }
    }
  }

  return (
    <div>
      <p className="font-kids mb-3 text-center text-lg font-bold text-[#4A90A4]">
        Match the English words!
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => flip(c.id)}
            className={`flex aspect-square items-center justify-center rounded-2xl text-center text-sm font-bold shadow transition ${
              c.flipped || c.matched
                ? "bg-white text-ink"
                : "bg-[#FFF176] text-[#F9A825]"
            }`}
          >
            {c.flipped || c.matched ? (
              <span>
                <span className="block text-2xl">{c.emoji}</span>
                {c.word}
              </span>
            ) : (
              "?"
            )}
          </button>
        ))}
      </div>
      {done && (
        <p className="mt-4 text-center font-kids text-xl font-bold text-success">
          Sunny says: Great job! +3 stars
        </p>
      )}
    </div>
  );
}

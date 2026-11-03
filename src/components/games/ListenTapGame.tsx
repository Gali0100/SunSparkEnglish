"use client";

import { useState } from "react";

const ITEMS = [
  { word: "red", color: "#ef5350" },
  { word: "blue", color: "#42a5f5" },
  { word: "green", color: "#66bb6a" },
  { word: "yellow", color: "#fff176" },
  { word: "orange", color: "#ffa726" },
  { word: "purple", color: "#ab47bc" },
];

function speak(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export function ListenTapGame({ onWin }: { onWin: (stars: number) => void }) {
  const [target, setTarget] = useState(() => ITEMS[Math.floor(Math.random() * ITEMS.length)]);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState("");

  function nextTarget(exclude?: string) {
    let pick = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    while (exclude && pick.word === exclude) {
      pick = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    }
    setTarget(pick);
    speak(pick.word);
  }

  function tap(word: string) {
    if (done) return;
    if (word === target.word) {
      const s = streak + 1;
      setStreak(s);
      setFeedback("Yes!");
      if (s >= 5) {
        setDone(true);
        onWin(3);
      } else {
        setTimeout(() => {
          setFeedback("");
          nextTarget(word);
        }, 400);
      }
    } else {
      setFeedback(`Listen again: ${target.word}`);
      speak(target.word);
    }
  }

  return (
    <div className="text-center">
      <p className="font-kids text-lg font-bold text-[#4A90A4]">Listen & Tap</p>
      <button
        type="button"
        className="btn-primary mt-4"
        onClick={() => speak(target.word)}
      >
        🔊 Hear the word
      </button>
      <p className="mt-2 text-sm text-ink-soft">Streak {streak}/5</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {ITEMS.map((item) => (
          <button
            key={item.word}
            type="button"
            onClick={() => tap(item.word)}
            className="rounded-2xl py-6 text-sm font-extrabold shadow"
            style={{ background: item.color, color: item.word === "yellow" ? "#333" : "#fff" }}
          >
            {item.word}
          </button>
        ))}
      </div>
      {feedback && <p className="mt-4 font-bold text-[#F9A825]">{feedback}</p>}
      {done && (
        <p className="mt-4 font-kids text-xl font-bold text-success">
          Amazing ears! +3 stars
        </p>
      )}
    </div>
  );
}

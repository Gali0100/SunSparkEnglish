"use client";

import { useState } from "react";

const ROUNDS = [
  { sound: "A says /æ/", options: ["apple", "elephant", "igloo"], answer: "apple" },
  { sound: "B says /b/", options: ["cat", "ball", "sun"], answer: "ball" },
  { sound: "S says /s/", options: ["sun", "dog", "moon"], answer: "sun" },
  { sound: "M says /m/", options: ["fish", "moon", "tree"], answer: "moon" },
  { sound: "T says /t/", options: ["tiger", "apple", "bird"], answer: "tiger" },
];

export function PhonicsGame({ onWin }: { onWin: (stars: number) => void }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const round = ROUNDS[i];

  function pick(opt: string) {
    if (done) return;
    const correct = opt === round.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setMsg(correct ? "Yes! Sunny is proud!" : `Almost — it was ${round.answer}`);
    setTimeout(() => {
      if (i + 1 >= ROUNDS.length) {
        setDone(true);
        onWin(Math.max(1, nextScore));
      } else {
        setI(i + 1);
        setMsg("");
      }
    }, 700);
  }

  return (
    <div className="text-center">
      <p className="font-kids text-lg font-bold text-[#4A90A4]">Phonics time!</p>
      {!done ? (
        <>
          <p className="mt-4 text-2xl font-extrabold">{round.sound}</p>
          <p className="mt-1 text-sm text-ink-soft">Tap the matching word</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {round.options.map((o) => (
              <button key={o} type="button" className="btn-sky" onClick={() => pick(o)}>
                {o}
              </button>
            ))}
          </div>
          {msg && <p className="mt-4 font-bold text-[#F9A825]">{msg}</p>}
        </>
      ) : (
        <p className="mt-6 font-kids text-xl font-bold text-success">
          Finished! Score {score}/{ROUNDS.length} · stars earned!
        </p>
      )}
    </div>
  );
}

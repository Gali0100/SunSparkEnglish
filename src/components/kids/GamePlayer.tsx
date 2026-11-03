"use client";

import { useRef, useTransition } from "react";
import { MemoryGame } from "@/components/games/MemoryGame";
import { PhonicsGame } from "@/components/games/PhonicsGame";
import { ListenTapGame } from "@/components/games/ListenTapGame";
import { addStars } from "@/lib/actions/student-actions";

export function GamePlayer({
  type,
  theme,
  studentId,
  title,
}: {
  type: "memory" | "phonics" | "listen";
  theme?: string;
  studentId: string;
  title: string;
}) {
  const awarded = useRef(false);
  const [, start] = useTransition();

  function onWin(stars: number) {
    if (awarded.current) return;
    awarded.current = true;
    start(async () => {
      await addStars(studentId, stars);
    });
  }

  return (
    <div className="card-soft p-6">
      <h1 className="mb-4 text-center text-2xl font-bold text-[#4A90A4]">{title}</h1>
      {type === "memory" && (
        <MemoryGame
          theme={(theme as "animals" | "school" | "travel" | "careers") || "animals"}
          onWin={onWin}
        />
      )}
      {type === "phonics" && <PhonicsGame onWin={onWin} />}
      {type === "listen" && <ListenTapGame onWin={onWin} />}
    </div>
  );
}

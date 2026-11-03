"use client";

import { useState } from "react";
import Image from "next/image";
import { PinExitModal } from "@/components/kids/PinExitModal";
import { ScreenTimeGuard } from "@/components/kids/ScreenTimeGuard";

export function KidsShell({
  studentId,
  studentName,
  stars,
  screenUsed,
  screenLimit,
  screenPending,
  children,
}: {
  studentId: string;
  studentName: string;
  stars: number;
  screenUsed: number;
  screenLimit: number;
  screenPending: boolean;
  children: React.ReactNode;
}) {
  const [pinOpen, setPinOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-sunspark.jpg"
            alt="Sunny"
            width={48}
            height={48}
            className="rounded-full ring-2 ring-[#FFF176]"
          />
          <div>
            <p className="text-sm font-bold text-[#F9A825]">SunSpark Kids</p>
            <p className="text-xs text-ink-soft">
              {studentName} · ⭐ {stars}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ScreenTimeGuard
            studentId={studentId}
            initialUsed={screenUsed}
            initialLimit={screenLimit}
            initialPending={screenPending}
          />
          <button type="button" className="btn-primary !py-2 text-sm" onClick={() => setPinOpen(true)}>
            Exit (PIN)
          </button>
        </div>
      </header>
      {children}
      <PinExitModal open={pinOpen} onClose={() => setPinOpen(false)} />
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { tickScreenTime, requestMoreTime } from "@/lib/actions/student-actions";
import { BRAND } from "@/lib/constants";

export function ScreenTimeGuard({
  studentId,
  initialUsed,
  initialLimit,
  initialPending,
}: {
  studentId: string;
  initialUsed: number;
  initialLimit: number;
  initialPending: boolean;
}) {
  const [used, setUsed] = useState(initialUsed);
  const [limit, setLimit] = useState(initialLimit);
  const [pendingAsk, setPendingAsk] = useState(initialPending);
  const [over, setOver] = useState(initialUsed >= initialLimit);
  const [, start] = useTransition();

  useEffect(() => {
    if (over) return;
    const id = setInterval(() => {
      start(async () => {
        const res = await tickScreenTime(studentId, 1);
        if (res.ok) {
          setUsed(res.minutesUsed!);
          setLimit(res.limit!);
          setOver(!!res.overLimit);
          setPendingAsk(!!res.pendingMoreTime);
        }
      });
    }, 60_000);
    return () => clearInterval(id);
  }, [studentId, over]);

  return (
    <div className="rounded-2xl bg-white/80 px-3 py-2 text-xs font-bold text-ink-soft">
      Screen time: {used}/{limit} min
      {over && (
        <div className="mt-2 space-y-2 text-sm text-ink">
          <p className="font-kids text-base text-danger">
            Time&apos;s up for today ({BRAND.screenLimitMinutes} min)!
          </p>
          {pendingAsk ? (
            <p>Waiting for a parent to approve more time…</p>
          ) : (
            <button
              type="button"
              className="btn-primary !py-2 text-xs"
              onClick={() => {
                start(async () => {
                  await requestMoreTime(studentId);
                  setPendingAsk(true);
                });
              }}
            >
              Ask parent for more time
            </button>
          )}
        </div>
      )}
    </div>
  );
}

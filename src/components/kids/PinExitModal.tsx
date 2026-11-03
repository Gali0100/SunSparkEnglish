"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkExitPin } from "@/lib/actions/student-actions";

export function PinExitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card-soft w-full max-w-sm space-y-4 p-6">
        <h2 className="font-kids text-xl font-bold text-[#4A90A4]">Parent PIN</h2>
        <p className="text-sm text-ink-soft">Enter the 4-digit PIN to leave the kids zone.</p>
        <input
          className="input-soft text-center text-2xl tracking-widest"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          maxLength={4}
          autoFocus
        />
        {error && <p className="text-sm font-bold text-danger">{error}</p>}
        <div className="flex gap-2">
          <button type="button" className="btn-sky flex-1" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary flex-1"
            disabled={pending || pin.length !== 4}
            onClick={() => {
              start(async () => {
                const res = await checkExitPin(pin);
                if (res.ok) router.push("/portal");
                else setError("Wrong PIN");
              });
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

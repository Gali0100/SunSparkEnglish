"use client";

import { useState, useTransition } from "react";
import { updateAvatar } from "@/lib/actions/student-actions";

const SKINS = ["#F5CBA7", "#E0AC69", "#C68642", "#8D5524", "#FFDBAC"];
const HAIRS = ["#5D4037", "#F9A825", "#212121", "#EF5350", "#4A90A4", "#FFF176"];
const EYES = ["#4A90A4", "#2E7D32", "#5D4037", "#1565C0", "#000"];
const TOPS = ["#FFF176", "#B2EBF2", "#FFAB91", "#C5E1A5", "#CE93D8"];
const ACCESSORIES = ["none", "bow", "hat", "glasses"];

export function AvatarBuilder({
  studentId,
  initial,
}: {
  studentId: string;
  initial: Record<string, string>;
}) {
  const [avatar, setAvatar] = useState({
    skin: initial.skin || SKINS[0],
    hair: initial.hair || HAIRS[0],
    eyes: initial.eyes || EYES[0],
    top: initial.top || TOPS[0],
    accessory: initial.accessory || "none",
  });
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="card-soft mx-auto max-w-md space-y-4 p-6">
      <div className="flex justify-center">
        <div
          className="relative flex h-28 w-28 items-center justify-center rounded-full shadow-inner"
          style={{ background: avatar.skin }}
        >
          <div
            className="absolute inset-x-3 top-1 h-8 rounded-t-full"
            style={{ background: avatar.hair }}
          />
          <div className="relative z-10 mt-4 flex gap-4">
            <span className="h-3 w-3 rounded-full" style={{ background: avatar.eyes }} />
            <span className="h-3 w-3 rounded-full" style={{ background: avatar.eyes }} />
          </div>
          <div
            className="absolute -bottom-2 h-10 w-20 rounded-b-2xl"
            style={{ background: avatar.top }}
          />
          {avatar.accessory === "bow" && (
            <span className="absolute -right-1 top-2 text-xl">🎀</span>
          )}
          {avatar.accessory === "hat" && (
            <span className="absolute -top-3 text-2xl">🎩</span>
          )}
          {avatar.accessory === "glasses" && (
            <span className="absolute top-10 text-lg">👓</span>
          )}
        </div>
      </div>

      {(
        [
          ["skin", SKINS],
          ["hair", HAIRS],
          ["eyes", EYES],
          ["top", TOPS],
        ] as const
      ).map(([key, colors]) => (
        <div key={key}>
          <p className="mb-1 text-xs font-bold capitalize">{key}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`h-8 w-8 rounded-full ring-2 ${
                  avatar[key] === c ? "ring-[#F9A825]" : "ring-white"
                }`}
                style={{ background: c }}
                onClick={() => setAvatar((a) => ({ ...a, [key]: c }))}
              />
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="mb-1 text-xs font-bold">Accessory</p>
        <div className="flex flex-wrap gap-2">
          {ACCESSORIES.map((a) => (
            <button
              key={a}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                avatar.accessory === a ? "bg-[#FFF176]" : "bg-[#E0F7FA]"
              }`}
              onClick={() => setAvatar((x) => ({ ...x, accessory: a }))}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn-primary w-full"
        disabled={pending}
        onClick={() => {
          start(async () => {
            await updateAvatar(studentId, avatar);
            setSaved(true);
          });
        }}
      >
        {pending ? "Saving…" : "Save avatar"}
      </button>
      {saved && <p className="text-center text-sm font-bold text-success">Saved!</p>}
    </div>
  );
}

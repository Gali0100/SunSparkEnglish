"use client";

import { useMemo, useState, useTransition } from "react";
import { CLASS_HOURS, formatHour, BANK, BRAND, whatsappLink } from "@/lib/constants";
import { createBooking } from "@/lib/actions/booking-actions";
import type { PaymentMethod } from "@/lib/types";

type StudentOpt = { id: string; name: string };

export function BookingCalendar({
  dates,
  labels,
  taken,
  blocked,
  students,
}: {
  dates: string[];
  labels: string[];
  taken: string[];
  blocked: string[];
  students: StudentOpt[];
}) {
  const takenSet = useMemo(() => new Set(taken), [taken]);
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const [selected, setSelected] = useState<{ date: string; hour: number } | null>(
    null
  );
  const [method, setMethod] = useState<PaymentMethod>("PAYPAL");
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function statusFor(date: string, hour: number) {
    if (blockedSet.has(date)) return "blocked";
    if (takenSet.has(`${date}-${hour}`)) return "busy";
    return "free";
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <div className="inline-grid min-w-full grid-flow-col gap-3">
          {dates.map((date, i) => (
            <div key={date} className="w-36 shrink-0">
              <p className="mb-2 text-center text-sm font-extrabold text-[#4A90A4]">
                {labels[i]}
              </p>
              <div className="space-y-2">
                {CLASS_HOURS.map((hour) => {
                  const st = statusFor(date, hour);
                  const isSel =
                    selected?.date === date && selected?.hour === hour;
                  const label =
                    st === "blocked"
                      ? "Bloqueado"
                      : st === "busy"
                        ? "Ocupado"
                        : "Disponible";
                  return (
                    <button
                      key={hour}
                      type="button"
                      disabled={st !== "free"}
                      onClick={() => setSelected({ date, hour })}
                      className={`w-full rounded-2xl px-2 py-2 text-left text-xs font-bold transition ${
                        st === "free"
                          ? isSel
                            ? "bg-[#FFF176] ring-2 ring-[#F9A825]"
                            : "bg-[#E0F7FA] hover:bg-[#B2EBF2]"
                          : st === "busy"
                            ? "cursor-not-allowed bg-[#ffe0e0] text-ink-soft"
                            : "cursor-not-allowed bg-gray-100 text-ink-soft"
                      }`}
                    >
                      <span className="block">{formatHour(hour)}</span>
                      <span className="opacity-80">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="card-soft animate-pop space-y-4 p-5">
          <h3 className="font-display text-xl text-[#4A90A4]">
            Reservar {labels[dates.indexOf(selected.date)]} ·{" "}
            {formatHour(selected.hour)} · Q{BRAND.priceGtq}
          </h3>

          {students.length > 0 ? (
            <label className="block text-sm font-bold">
              Estudiante
              <select
                className="input-soft mt-1"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="text-sm text-warn">
              Agrega un perfil de hijo antes de reservar (sección Perfiles).
            </p>
          )}

          <fieldset className="space-y-2">
            <legend className="text-sm font-bold">Método de pago</legend>
            {(
              [
                ["PAYPAL", "PayPal (confirmación al instante en demo)"],
                ["TRANSFER", "Transferencia bancaria"],
                ["CASH", "Efectivo (apartar horario)"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="method"
                  checked={method === value}
                  onChange={() => setMethod(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          {method === "TRANSFER" && (
            <div className="rounded-2xl bg-[#E0F7FA] p-4 text-sm">
              <p className="font-bold">Datos bancarios</p>
              <p>{BANK.name} · {BANK.type}</p>
              <p>{BANK.accountName}</p>
              <p className="font-mono">{BANK.accountNumber}</p>
              <p className="mt-2 text-ink-soft">
                La acreditación puede tardar ~24 h. El pago debe figurar 1 día
                antes de la clase (transferencia inmediata: día de clase OK).
              </p>
            </div>
          )}

          {method === "CASH" && (
            <div className="rounded-2xl bg-[#FFF9C4] p-4 text-sm">
              <p>
                Tu cita quedará <strong>Apartada — pendiente de efectivo</strong>.
                Coordina la entrega con Miss Gali. Si no está pagada 24 h antes,
                se libera el horario.
              </p>
              <a
                className="mt-2 inline-block font-bold text-[#128C7E]"
                href={whatsappLink(
                  `Hola Miss Gali, quiero pagar en efectivo la clase del ${selected.date} a las ${formatHour(selected.hour)}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir WhatsApp
              </a>
            </div>
          )}

          <button
            type="button"
            className="btn-primary"
            disabled={pending || !students.length}
            onClick={() => {
              start(async () => {
                setMsg(null);
                const res = await createBooking({
                  date: selected.date,
                  startHour: selected.hour,
                  studentId: studentId || undefined,
                  paymentMethod: method,
                });
                if (res.error) setMsg(res.error);
                else {
                  const map: Record<string, string> = {
                    CONFIRMED: "¡Confirmada!",
                    HELD_CASH: "Apartada — pendiente de efectivo.",
                    PENDING_TRANSFER: "Pendiente de transferencia.",
                  };
                  setMsg(map[res.status || ""] || "Reserva creada.");
                  setSelected(null);
                }
              });
            }}
          >
            {pending ? "Reservando…" : "Confirmar reserva"}
          </button>
          {msg && <p className="text-sm font-bold text-[#4A90A4]">{msg}</p>}
        </div>
      )}
    </div>
  );
}

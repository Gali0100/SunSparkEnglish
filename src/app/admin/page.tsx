import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatHour } from "@/lib/constants";
import { upcomingWeekdays, weekdayLabelEs } from "@/lib/dates";
import {
  blockDay,
  unblockDay,
  markPaymentReceived,
  releaseHold,
  confirmBookingAdmin,
  autoReleaseOverdueHolds,
} from "@/lib/actions/admin-actions";
import { CLASS_HOURS } from "@/lib/constants";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/portal");

  const dates = upcomingWeekdays(new Date(), 14);
  const [bookings, blocked, pending] = await Promise.all([
    prisma.booking.findMany({
      where: {
        date: { in: dates },
        status: { in: ["HELD_CASH", "PENDING_TRANSFER", "CONFIRMED"] },
      },
      include: { parent: true, student: true },
      orderBy: [{ date: "asc" }, { startHour: "asc" }],
    }),
    prisma.blockedDay.findMany({ where: { date: { in: dates } } }),
    prisma.booking.findMany({
      where: {
        status: { in: ["HELD_CASH", "PENDING_TRANSFER"] },
        paymentStatus: "PENDING",
      },
      include: { parent: true, student: true },
      orderBy: [{ date: "asc" }, { startHour: "asc" }],
    }),
  ]);

  const blockedSet = new Set(blocked.map((b) => b.date));
  const bySlot = new Map(bookings.map((b) => [`${b.date}-${b.startHour}`, b]));

  return (
    <div className="space-y-10">
      <p className="text-sm text-ink-soft">
        Aviso operativo: avisar feriados con ~30 días de anticipación cuando sea
        posible.
      </p>

      <section className="card-soft p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-[#F9A825]">Calendario</h2>
          <form
            action={async () => {
              "use server";
              await autoReleaseOverdueHolds();
            }}
          >
            <button type="submit" className="text-sm font-bold text-danger">
              Liberar apartados &lt;24 h sin pago
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-grid min-w-full grid-flow-col gap-3">
            {dates.map((date) => (
              <div key={date} className="w-40 shrink-0">
                <p className="mb-1 text-center text-sm font-extrabold">
                  {weekdayLabelEs(date)}
                </p>
                {blockedSet.has(date) ? (
                  <form
                    action={async () => {
                      "use server";
                      await unblockDay(date);
                    }}
                    className="mb-2"
                  >
                    <button className="w-full rounded-xl bg-gray-200 py-1 text-xs font-bold">
                      Desbloquear día
                    </button>
                  </form>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await blockDay(date, "Feriado / no disponible");
                    }}
                    className="mb-2"
                  >
                    <button className="w-full rounded-xl bg-[#FFF9C4] py-1 text-xs font-bold">
                      Bloquear día
                    </button>
                  </form>
                )}
                <div className="space-y-1">
                  {CLASS_HOURS.map((hour) => {
                    const b = bySlot.get(`${date}-${hour}`);
                    return (
                      <div
                        key={hour}
                        className={`rounded-xl px-2 py-1.5 text-xs ${
                          blockedSet.has(date)
                            ? "bg-gray-100"
                            : b
                              ? b.status === "CONFIRMED"
                                ? "bg-[#c8e6c9]"
                                : "bg-[#ffe0b2]"
                              : "bg-[#E0F7FA]"
                        }`}
                      >
                        <p className="font-bold">{formatHour(hour)}</p>
                        {b ? (
                          <p className="truncate">
                            {b.student?.name || "—"} · {b.parent.name}
                            <br />
                            {b.status} / {b.paymentMethod}
                          </p>
                        ) : (
                          <p>{blockedSet.has(date) ? "Bloqueado" : "Libre"}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card-soft p-5">
        <h2 className="font-display text-2xl text-[#4A90A4]">
          Pagos pendientes / apartados
        </h2>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Nada pendiente.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pending.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 p-4"
              >
                <div className="text-sm">
                  <p className="font-bold">
                    {b.date} {formatHour(b.startHour)} · {b.student?.name || "—"}
                  </p>
                  <p className="text-ink-soft">
                    {b.parent.name} ({b.parent.email}) · {b.paymentMethod} ·{" "}
                    {b.status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await markPaymentReceived(b.id);
                    }}
                  >
                    <button type="submit" className="btn-primary !py-2 text-xs">
                      Marcar pagado
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await confirmBookingAdmin(b.id);
                    }}
                  >
                    <button type="submit" className="btn-sky !py-2 text-xs">
                      Confirmar hoy
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await releaseHold(b.id);
                    }}
                  >
                    <button type="submit" className="text-xs font-bold text-danger">
                      Liberar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatHour } from "@/lib/constants";
import { grantMoreTime } from "@/lib/actions/student-actions";
import { cancelBooking } from "@/lib/actions/booking-actions";
import { redirect } from "next/navigation";
import { todayStr } from "@/lib/dates";

export default async function PortalHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [students, bookings, credits, timeRequests] = await Promise.all([
    prisma.student.findMany({
      where: { parentId: session.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        parentId: session.user.id,
        status: { in: ["HELD_CASH", "PENDING_TRANSFER", "CONFIRMED"] },
      },
      include: { student: true },
      orderBy: [{ date: "asc" }, { startHour: "asc" }],
      take: 10,
    }),
    prisma.classCredit.findMany({
      where: { parentId: session.user.id, usedAt: null, expiresAt: { gt: new Date() } },
    }),
    prisma.screenTime.findMany({
      where: {
        date: todayStr(),
        pendingMoreTime: true,
        student: { parentId: session.user.id },
      },
      include: { student: true },
    }),
  ]);

  const statusLabel: Record<string, string> = {
    CONFIRMED: "Confirmada",
    HELD_CASH: "Apartada (efectivo)",
    PENDING_TRANSFER: "Pendiente transferencia",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#4A90A4]">Portal de Padres</h1>
        <p className="text-ink-soft">Hola, {session.user.name}</p>
      </div>

      {timeRequests.length > 0 && (
        <section className="card-soft space-y-3 border-2 border-[#FFF176] p-5">
          <h2 className="font-display text-xl">Piden más tiempo de pantalla</h2>
          {timeRequests.map((t) => (
            <form
              key={t.id}
              className="flex flex-wrap items-end gap-2"
              action={async (fd) => {
                "use server";
                await grantMoreTime(t.studentId, 15, String(fd.get("pin") || ""));
              }}
            >
              <p className="flex-1 text-sm font-bold">{t.student.name} (+15 min)</p>
              <input
                name="pin"
                placeholder="PIN"
                className="input-soft !w-24"
                maxLength={4}
                required
              />
              <button className="btn-sky !py-2 text-sm" type="submit">
                Aprobar
              </button>
            </form>
          ))}
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-[#F9A825]">Perfiles</h2>
          <Link href="/portal/hijos" className="text-sm font-bold text-[#4A90A4]">
            Gestionar
          </Link>
        </div>
        {students.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Aún no hay perfiles.{" "}
            <Link href="/portal/hijos" className="font-bold text-[#4A90A4]">
              Agregar hijo/a
            </Link>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {students.map((s) => (
              <div key={s.id} className="card-soft flex items-center gap-4 p-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white"
                  style={{
                    background: JSON.parse(s.avatarJson || "{}").top || "#B2EBF2",
                  }}
                >
                  {s.name[0]}
                </div>
                <div>
                  <p className="font-extrabold">{s.name}</p>
                  <p className="text-sm text-ink-soft">
                    {s.age} años · ⭐ {s.stars}
                  </p>
                  <Link
                    href={`/kids?student=${s.id}`}
                    className="text-sm font-bold text-[#4A90A4]"
                  >
                    Jugar como {s.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-[#4A90A4]">Próximas clases</h2>
          <Link href="/portal/reservar" className="btn-primary !py-2 text-sm">
            Reservar
          </Link>
        </div>
        {credits.length > 0 && (
          <p className="mb-2 text-sm font-bold text-success">
            Créditos disponibles: {credits.length}
          </p>
        )}
        {bookings.length === 0 ? (
          <p className="text-sm text-ink-soft">No hay reservas activas.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="card-soft flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="font-bold">
                    {b.date} · {formatHour(b.startHour)}
                    {b.student ? ` · ${b.student.name}` : ""}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {statusLabel[b.status]} · {b.paymentMethod} ·{" "}
                    {b.paymentStatus === "PAID" ? "Pagado" : "Pago pendiente"}
                  </p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await cancelBooking(b.id);
                  }}
                >
                  <button type="submit" className="text-sm font-bold text-danger">
                    Cancelar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

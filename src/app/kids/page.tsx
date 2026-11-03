import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AGE_BANDS, GAMES_BY_BAND } from "@/lib/constants";
import { todayStr } from "@/lib/dates";
import { BRAND } from "@/lib/constants";
import { KidsShell } from "@/components/kids/KidsShell";

export default async function KidsHome({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  const sp = await searchParams;

  const students = await prisma.student.findMany({
    where: { parentId: session.user.id },
    orderBy: { name: "asc" },
  });

  if (students.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#4A90A4]">No players yet</h1>
        <p className="mt-2 text-ink-soft">Ask a parent to add a student profile.</p>
        <Link href="/portal/hijos" className="btn-primary mt-6 inline-block">
          Go to profiles
        </Link>
      </div>
    );
  }

  const student =
    students.find((s) => s.id === sp.student) || students[0];

  const screen = await prisma.screenTime.findUnique({
    where: { studentId_date: { studentId: student.id, date: todayStr() } },
  });
  const used = screen?.minutesUsed || 0;
  const extra = screen?.extraMinutesGranted || 0;
  const limit = BRAND.screenLimitMinutes + extra;

  const games = GAMES_BY_BAND[student.ageBand] || [];
  const bandLabel =
    AGE_BANDS.find((b) => b.id === student.ageBand)?.label || student.ageBand;

  return (
    <KidsShell
      studentId={student.id}
      studentName={student.name}
      stars={student.stars}
      screenUsed={used}
      screenLimit={limit}
      screenPending={!!screen?.pendingMoreTime}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {students.map((s) => (
          <Link
            key={s.id}
            href={`/kids?student=${s.id}`}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              s.id === student.id ? "bg-[#FFF176]" : "bg-white/70"
            }`}
          >
            Play as {s.name}
          </Link>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#4A90A4]">
            Hi, {student.name}!
          </h1>
          <p className="text-ink-soft">Age band {bandLabel} · ⭐ {student.stars}</p>
        </div>
        <Link
          href={`/kids/avatar?student=${student.id}`}
          className="btn-sky !py-2 text-sm"
        >
          Avatar builder
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {games.map((g) =>
          g.playable ? (
            <Link
              key={g.slug}
              href={`/kids/play/${student.ageBand}/${g.slug}?student=${student.id}`}
              className="card-soft animate-pop flex aspect-square flex-col items-center justify-center p-3 text-center hover:scale-[1.02]"
            >
              <span className="text-2xl">🎮</span>
              <span className="mt-2 text-sm font-bold">{g.title}</span>
            </Link>
          ) : (
            <div
              key={g.slug}
              className="flex aspect-square flex-col items-center justify-center rounded-[1.5rem] bg-white/50 p-3 text-center opacity-70"
            >
              <span className="text-xl">🚧</span>
              <span className="mt-2 text-xs font-bold">{g.title}</span>
              <span className="mt-1 text-[10px] text-ink-soft">
                Coming soon — Miss Gali is preparing this!
              </span>
            </div>
          )
        )}
      </div>
    </KidsShell>
  );
}

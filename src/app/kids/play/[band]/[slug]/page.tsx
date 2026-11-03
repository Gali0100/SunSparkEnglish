import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { GAMES_BY_BAND, BRAND } from "@/lib/constants";
import { todayStr } from "@/lib/dates";
import { KidsShell } from "@/components/kids/KidsShell";
import { GamePlayer } from "@/components/kids/GamePlayer";

const THEME_BY_SLUG: Record<string, string> = {
  "memory-animals": "animals",
  "memory-school": "school",
  "memory-travel": "travel",
  "memory-careers": "careers",
};

export default async function PlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ band: string; slug: string }>;
  searchParams: Promise<{ student?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  const { band, slug } = await params;
  const sp = await searchParams;

  const student = await prisma.student.findFirst({
    where: { id: sp.student, parentId: session.user.id },
  });
  if (!student) redirect("/kids");

  const games = GAMES_BY_BAND[band];
  const game = games?.find((g) => g.slug === slug);
  if (!game || !game.playable || !game.type) notFound();

  const screen = await prisma.screenTime.findUnique({
    where: { studentId_date: { studentId: student.id, date: todayStr() } },
  });
  const used = screen?.minutesUsed || 0;
  const limit = BRAND.screenLimitMinutes + (screen?.extraMinutesGranted || 0);

  return (
    <KidsShell
      studentId={student.id}
      studentName={student.name}
      stars={student.stars}
      screenUsed={used}
      screenLimit={limit}
      screenPending={!!screen?.pendingMoreTime}
    >
      <Link
        href={`/kids?student=${student.id}`}
        className="mb-4 inline-block text-sm font-bold text-[#4A90A4]"
      >
        ← Game shelf
      </Link>
      <GamePlayer
        type={game.type}
        theme={THEME_BY_SLUG[slug]}
        studentId={student.id}
        title={game.title}
      />
    </KidsShell>
  );
}

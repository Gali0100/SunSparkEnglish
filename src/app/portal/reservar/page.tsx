import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { upcomingWeekdays, weekdayLabelEs } from "@/lib/dates";
import { BookingCalendar } from "@/components/BookingCalendar";
import { getAvailability } from "@/lib/actions/booking-actions";

export default async function ReservarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const dates = upcomingWeekdays(new Date(), 10);
  const students = await prisma.student.findMany({
    where: { parentId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const { taken, blockedSet } = await getAvailability(dates);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-[#4A90A4]">Reservar horario</h1>
      <p className="text-sm text-ink-soft">
        Lun–vie · 2:00–6:00 PM Guatemala · Q75 · 1 niño por bloque
      </p>
      <BookingCalendar
        dates={dates}
        labels={dates.map(weekdayLabelEs)}
        taken={taken}
        blocked={blockedSet}
        students={students}
      />
    </div>
  );
}

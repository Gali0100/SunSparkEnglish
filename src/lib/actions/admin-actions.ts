"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
  return session.user;
}

export async function blockDay(date: string, reason?: string) {
  await requireAdmin();
  await prisma.blockedDay.upsert({
    where: { date },
    update: { reason: reason || null },
    create: { date, reason: reason || null },
  });
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { ok: true };
}

export async function unblockDay(date: string) {
  await requireAdmin();
  await prisma.blockedDay.deleteMany({ where: { date } });
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { ok: true };
}

export async function markPaymentReceived(bookingId: string) {
  await requireAdmin();
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { error: "No encontrada" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
    },
  });
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { ok: true };
}

export async function releaseHold(bookingId: string) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "RELEASED" },
  });
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { ok: true };
}

export async function confirmBookingAdmin(bookingId: string) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED", paymentStatus: "PAID" },
  });
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { ok: true };
}

/** Release unpaid cash/transfer holds that are within 24h of class */
export async function autoReleaseOverdueHolds() {
  await requireAdmin();
  const active = await prisma.booking.findMany({
    where: {
      status: { in: ["HELD_CASH", "PENDING_TRANSFER"] },
      paymentStatus: "PENDING",
    },
  });

  const now = Date.now();
  let released = 0;
  for (const b of active) {
    const classAt = new Date(`${b.date}T${String(b.startHour).padStart(2, "0")}:00:00`).getTime();
    const hoursLeft = (classAt - now) / (1000 * 60 * 60);
    if (hoursLeft < 24) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { status: "RELEASED" },
      });
      released++;
    }
  }
  revalidatePath("/admin");
  return { ok: true, released };
}

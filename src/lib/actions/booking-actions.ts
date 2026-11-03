"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BRAND, CLASS_HOURS } from "@/lib/constants";
import { isAtLeast24hBefore, isPastSlot } from "@/lib/dates";
import { createPayPalOrder, capturePayPalOrder, isPayPalMock } from "@/lib/paypal";
import { addDays } from "date-fns";
import type { PaymentMethod } from "@/lib/types";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  return session.user;
}

export async function getAvailability(dates: string[]) {
  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: {
        date: { in: dates },
        status: { in: ["HELD_CASH", "PENDING_TRANSFER", "CONFIRMED"] },
      },
    }),
    prisma.blockedDay.findMany({ where: { date: { in: dates } } }),
  ]);

  const blockedSet = new Set(blocked.map((b) => b.date));
  const taken = new Set(bookings.map((b) => `${b.date}-${b.startHour}`));

  return { blockedSet: [...blockedSet], taken: [...taken], bookings };
}

export async function createBooking(input: {
  date: string;
  startHour: number;
  studentId?: string;
  paymentMethod: PaymentMethod;
}) {
  const user = await requireUser();
  const { date, startHour, studentId, paymentMethod } = input;

  if (!(CLASS_HOURS as readonly number[]).includes(startHour)) {
    return { error: "Horario inválido." };
  }
  if (isPastSlot(date, startHour)) {
    return { error: "Ese horario ya pasó." };
  }

  const blocked = await prisma.blockedDay.findUnique({ where: { date } });
  if (blocked) return { error: "Ese día está bloqueado (feriado / no disponible)." };

  if (studentId) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, parentId: user.id },
    });
    if (!student) return { error: "Estudiante no encontrado." };
  }

  let status: "HELD_CASH" | "PENDING_TRANSFER" | "CONFIRMED" =
    paymentMethod === "CASH"
      ? "HELD_CASH"
      : paymentMethod === "TRANSFER"
        ? "PENDING_TRANSFER"
        : "CONFIRMED"; // PayPal mock confirms instantly

  let paymentStatus: "PENDING" | "PAID" = paymentMethod === "PAYPAL" ? "PAID" : "PENDING";

  try {
    const booking = await prisma.booking.create({
      data: {
        parentId: user.id,
        studentId: studentId || null,
        date,
        startHour,
        status,
        paymentMethod,
        paymentStatus,
        amountGtq: BRAND.priceGtq,
      },
    });

    let paypal: Awaited<ReturnType<typeof createPayPalOrder>> | null = null;
    if (paymentMethod === "PAYPAL") {
      paypal = await createPayPalOrder(BRAND.priceGtq, booking.id);
      if (!isPayPalMock() && paypal.approveUrl) {
        // Live PayPal would redirect; keep pending until capture webhook
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "PENDING_TRANSFER", paymentStatus: "PENDING", notes: paypal.orderId },
        });
        status = "PENDING_TRANSFER";
        paymentStatus = "PENDING";
      } else {
        await capturePayPalOrder(paypal.orderId);
      }
    }

    revalidatePath("/portal");
    revalidatePath("/admin");
    return { ok: true, bookingId: booking.id, status, paymentStatus, paypal };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint")) {
      return { error: "Ese horario acaba de ocuparse. Elige otro." };
    }
    throw e;
  }
}

export async function cancelBooking(bookingId: string) {
  const user = await requireUser();
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, parentId: user.id },
  });
  if (!booking) return { error: "Reserva no encontrada." };
  if (booking.status === "CANCELLED" || booking.status === "RELEASED") {
    return { error: "Ya está cancelada." };
  }

  const grantCredit = isAtLeast24hBefore(booking.date, booking.startHour);

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    if (grantCredit && booking.paymentStatus === "PAID") {
      await tx.classCredit.create({
        data: {
          parentId: user.id,
          expiresAt: addDays(new Date(), BRAND.creditExpiryDays),
        },
      });
    }
  });

  revalidatePath("/portal");
  return {
    ok: true,
    creditGranted: grantCredit && booking.paymentStatus === "PAID",
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ageToBand, BRAND } from "@/lib/constants";
import { todayStr } from "@/lib/dates";
import { verifyParentPin } from "@/lib/actions/auth-actions";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  return session.user;
}

export async function createStudent(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const age = Number(formData.get("age"));
  if (!name || !age || age < 6 || age > 17) {
    return { error: "Nombre y edad (6–17) son obligatorios." };
  }
  const ageBand = ageToBand(age);
  if (!ageBand) return { error: "Edad fuera de rango." };

  await prisma.student.create({
    data: {
      parentId: user.id,
      name,
      age,
      ageBand,
      avatarJson: JSON.stringify({
        skin: "#F5CBA7",
        hair: "#5D4037",
        eyes: "#4A90A4",
        top: "#FFF176",
        accessory: "none",
      }),
    },
  });
  revalidatePath("/portal");
  revalidatePath("/kids");
  return { ok: true };
}

export async function updateAvatar(studentId: string, avatar: Record<string, string>) {
  const user = await requireUser();
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentId: user.id },
  });
  if (!student) return { error: "No encontrado" };

  await prisma.student.update({
    where: { id: studentId },
    data: { avatarJson: JSON.stringify(avatar) },
  });
  revalidatePath("/kids");
  revalidatePath("/portal");
  return { ok: true };
}

export async function addStars(studentId: string, amount: number) {
  const user = await requireUser();
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentId: user.id },
  });
  if (!student) return { error: "No encontrado" };

  await prisma.student.update({
    where: { id: studentId },
    data: { stars: { increment: amount } },
  });
  revalidatePath("/kids");
  return { ok: true, stars: student.stars + amount };
}

export async function tickScreenTime(studentId: string, minutes: number) {
  const user = await requireUser();
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentId: user.id },
  });
  if (!student) return { error: "No encontrado" };

  const date = todayStr();
  const row = await prisma.screenTime.upsert({
    where: { studentId_date: { studentId, date } },
    update: { minutesUsed: { increment: minutes } },
    create: { studentId, date, minutesUsed: minutes },
  });

  const limit = BRAND.screenLimitMinutes + row.extraMinutesGranted;
  return {
    ok: true,
    minutesUsed: row.minutesUsed,
    limit,
    overLimit: row.minutesUsed >= limit,
    pendingMoreTime: row.pendingMoreTime,
  };
}

export async function requestMoreTime(studentId: string) {
  const user = await requireUser();
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentId: user.id },
  });
  if (!student) return { error: "No encontrado" };

  const date = todayStr();
  await prisma.screenTime.upsert({
    where: { studentId_date: { studentId, date } },
    update: { pendingMoreTime: true },
    create: { studentId, date, pendingMoreTime: true },
  });
  revalidatePath("/portal");
  return { ok: true };
}

export async function grantMoreTime(studentId: string, extraMinutes: number, pin: string) {
  const user = await requireUser();
  const ok = await verifyParentPin(user.id, pin);
  if (!ok) return { error: "PIN incorrecto" };

  const date = todayStr();
  await prisma.screenTime.upsert({
    where: { studentId_date: { studentId, date } },
    update: {
      extraMinutesGranted: { increment: extraMinutes },
      pendingMoreTime: false,
    },
    create: {
      studentId,
      date,
      extraMinutesGranted: extraMinutes,
      pendingMoreTime: false,
    },
  });
  revalidatePath("/portal");
  revalidatePath("/kids");
  return { ok: true };
}

export async function checkExitPin(pin: string) {
  const user = await requireUser();
  const ok = await verifyParentPin(user.id, pin);
  return { ok };
}

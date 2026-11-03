"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  parentPin: z.string().regex(/^\d{4}$/),
  tutorConsent: z.literal("on"),
});

export async function registerParent(formData: FormData) {
  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    password: String(formData.get("password") || ""),
    parentPin: String(formData.get("parentPin") || ""),
    tutorConsent: formData.get("tutorConsent") === "on" ? "on" : "",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Revisa los datos. PIN de 4 dígitos y consentimiento son obligatorios." };
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const passwordHash = await hash(parsed.data.password, 10);
  const role = parsed.data.email === ADMIN_EMAIL ? "ADMIN" : "PARENT";

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      parentPin: parsed.data.parentPin,
      role,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/portal",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Cuenta creada, pero no se pudo iniciar sesión. Intenta entrar." };
    }
    throw e;
  }
}

export async function loginParent(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: formData.get("callbackUrl")?.toString() || "/portal",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }
    throw e;
  }
}

export async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export async function verifyParentPin(userId: string, pin: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  return user.parentPin === pin;
}

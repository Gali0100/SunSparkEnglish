"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { registerParent } from "@/lib/actions/auth-actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <main className="bg-brand-wash flex min-h-screen items-center justify-center px-4 py-12">
      <form
        className="card-soft w-full max-w-md space-y-4 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            const res = await registerParent(fd);
            if (res?.error) setError(res.error);
          });
        }}
      >
        <h1 className="font-display text-center text-3xl text-[#4A90A4]">
          Crear cuenta de padre/tutor
        </h1>
        {error && (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-bold text-danger">
            {error}
          </p>
        )}
        <label className="block text-sm font-bold">
          Nombre
          <input className="input-soft mt-1" name="name" required minLength={2} />
        </label>
        <label className="block text-sm font-bold">
          Correo
          <input className="input-soft mt-1" name="email" type="email" required />
        </label>
        <label className="block text-sm font-bold">
          Contraseña (mín. 6)
          <input
            className="input-soft mt-1"
            name="password"
            type="password"
            required
            minLength={6}
          />
        </label>
        <label className="block text-sm font-bold">
          PIN parental (4 dígitos — para salir de juegos)
          <input
            className="input-soft mt-1"
            name="parentPin"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            required
            placeholder="1234"
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="tutorConsent" required className="mt-1" />
          <span>
            Soy padre/tutor y autorizo el uso de datos de menores bajo mi cuidado
            según la{" "}
            <Link href="/privacidad" className="font-bold text-[#4A90A4]">
              política de privacidad
            </Link>
            .
          </span>
        </label>
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Creando…" : "Crear cuenta"}
        </button>
        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="font-bold text-[#4A90A4]">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}

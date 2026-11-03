import Link from "next/link";
import { loginParent } from "@/lib/actions/auth-actions";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;

  async function action(formData: FormData) {
    "use server";
    if (sp.callbackUrl) formData.set("callbackUrl", sp.callbackUrl);
    await loginParent(formData);
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-brand-wash flex flex-1 items-center justify-center px-4 py-12">
        <form action={action} className="card-soft w-full max-w-md space-y-4 p-8">
          <h1 className="font-display text-center text-3xl text-[#4A90A4]">Entrar</h1>
          <p className="text-center text-sm text-ink-soft">
            Demo: padre@demo.com / padre123 · Admin: fergie0a04@gmail.com
          </p>
          <label className="block text-sm font-bold">
            Correo
            <input className="input-soft mt-1" name="email" type="email" required />
          </label>
          <label className="block text-sm font-bold">
            Contraseña
            <input className="input-soft mt-1" name="password" type="password" required />
          </label>
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
          <p className="text-center text-sm">
            ¿Nuevo?{" "}
            <Link href="/auth/register" className="font-bold text-[#4A90A4]">
              Crear cuenta
            </Link>
          </p>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}

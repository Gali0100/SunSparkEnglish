import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/sobre", label: "Sobre Miss Gali" },
  { href: "/horarios", label: "Horarios y Políticas" },
  { href: "/juegos", label: "Juegos" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#fff9c4cc] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-sunspark.jpg"
            alt="SunSpark English"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-[#FFF176]"
            priority
          />
          <span className="font-display text-lg font-semibold leading-tight text-[#4A90A4] sm:text-xl">
            SunSpark <span className="text-[#F9A825]">English</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-bold text-ink hover:bg-[#FFF176]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="btn-sky !px-3 !py-2 text-sm">
                  Admin
                </Link>
              )}
              <Link href="/portal" className="btn-primary !px-3 !py-2 text-sm">
                Portal
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-sm font-bold text-ink-soft hover:text-ink">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-bold text-ink-soft hover:text-ink">
                Entrar
              </Link>
              <Link href="/auth/register" className="btn-primary !px-3 !py-2 text-sm">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

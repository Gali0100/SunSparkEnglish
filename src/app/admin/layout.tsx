import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="bg-brand-wash flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl text-[#4A90A4]">Panel Miss Gali</h1>
            <nav className="flex gap-2">
              <Link href="/admin" className="btn-sky !py-2 text-sm">
                Calendario
              </Link>
              <Link href="/portal" className="text-sm font-bold text-ink-soft self-center">
                Portal padres
              </Link>
            </nav>
          </div>
          {children}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

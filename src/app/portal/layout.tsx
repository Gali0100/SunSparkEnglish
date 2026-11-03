import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const links = [
  { href: "/portal", label: "Inicio" },
  { href: "/portal/reservar", label: "Reservar" },
  { href: "/portal/hijos", label: "Perfiles" },
  { href: "/horarios", label: "Políticas" },
  { href: "/kids", label: "Juegos" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="bg-brand-wash flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
          <aside className="md:w-52">
            <nav className="flex gap-2 overflow-x-auto rounded-[2rem] bg-[#FFF9C4] p-3 md:flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="shrink-0 rounded-full px-4 py-2 text-sm font-extrabold text-ink hover:bg-[#FFF176]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}

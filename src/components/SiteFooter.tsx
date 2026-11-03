import Link from "next/link";
import { BRAND, whatsappLink } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#B2EBF2] bg-[#E0F7FA]/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-[#4A90A4]">
            SunSpark <span className="text-[#F9A825]">English</span>
          </p>
          <p className="text-sm text-ink-soft">
            Clases 1:1 con {BRAND.teacher} · Guatemala
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <Link href="/privacidad" className="text-ink-soft hover:text-ink">
            Privacidad
          </Link>
          <Link href="/horarios" className="text-ink-soft hover:text-ink">
            Políticas
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#128C7E] hover:underline"
          >
            WhatsApp {BRAND.whatsappDisplay}
          </a>
        </div>
      </div>
    </footer>
  );
}

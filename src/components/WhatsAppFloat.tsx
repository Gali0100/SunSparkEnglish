import { BRAND, whatsappLink } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hola Miss Gali, quiero información sobre clases de SunSpark English.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
      aria-label={`WhatsApp ${BRAND.whatsappDisplay}`}
    >
      <span className="text-lg" aria-hidden>
        💬
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

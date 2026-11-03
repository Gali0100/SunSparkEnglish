import Image from "next/image";
import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = { title: "Sobre Miss Gali" };

export default function SobrePage() {
  return (
    <div className="bg-brand-wash px-4 py-12">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
        <Image
          src="/miss-gali-sunny.jpg"
          alt="Miss Gali y Sunny"
          width={480}
          height={480}
          className="mx-auto rounded-[2rem] shadow-lg ring-4 ring-white"
        />
        <div className="card-soft p-8">
          <h1 className="font-display text-3xl text-[#4A90A4]">Sobre Miss Gali</h1>
          <p className="mt-4 text-ink-soft leading-relaxed">
            ¡Hola! Soy <strong>{BRAND.teacher}</strong>, la profesora detrás de{" "}
            <strong>SunSpark English</strong>. Acompaño a niños y adolescentes
            (6–17 años) a aprender inglés con calidez, juego y práctica real en
            clases 1:1.
          </p>
          <p className="mt-3 text-ink-soft leading-relaxed">
            {/* TODO: Fernanda puede reemplazar este texto con su biografía final */}
            Aquí encontrarás reservas, políticas claras y una zona de juegos para
            practicar en casa con Sunny. Este párrafo es un marcador de posición
            hasta que Miss Gali publique su historia completa.
          </p>
          <p className="mt-3 text-sm font-bold text-[#F9A825]">
            Guatemala · WhatsApp {BRAND.whatsappDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}

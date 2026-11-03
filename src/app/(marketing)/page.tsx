import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="bg-brand-wash">
      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2">
        <div className="animate-pop z-10 order-2 lg:order-1">
          <p className="font-display mb-2 text-4xl font-bold tracking-tight text-[#4A90A4] sm:text-5xl md:text-6xl">
            SunSpark <span className="text-[#F9A825]">English</span>
          </p>
          <h1 className="mt-3 max-w-lg text-xl font-bold text-ink sm:text-2xl">
            Inglés 1:1 con Miss Gali — y juegos que hacen brillar a tus hijos
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-soft">
            Portal para padres en español. Zona de juegos en inglés. Clases de{" "}
            {BRAND.sessionMinutes} min · Q{BRAND.priceGtq} · Guatemala.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/register" className="btn-primary">
              Crear cuenta de padre
            </Link>
            <Link href="/horarios" className="btn-sky">
              Ver horarios
            </Link>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="animate-float absolute -left-2 top-6 h-24 w-24 rounded-full bg-[#FFF176]/80 blur-2xl" />
          <div className="animate-wiggle absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-[#B2EBF2]/70 blur-2xl" />
          <Image
            src="/miss-gali-sunny.jpg"
            alt="Miss Gali y Sunny, la mascota de SunSpark English"
            width={720}
            height={720}
            priority
            className="relative mx-auto w-full max-w-md rounded-[2.5rem] object-cover shadow-xl ring-4 ring-white"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Reserva fácil",
              body: "Lunes a viernes, 2:00–6:00 PM (Guatemala). Un niño por hora.",
            },
            {
              title: "Pago flexible",
              body: "PayPal, transferencia o efectivo. Miss Gali confirma en el panel.",
            },
            {
              title: "Juegos con estrellas",
              body: "Memory, Phonics y Listen & Tap por edad — con límite de pantalla.",
            },
          ].map((c, i) => (
            <div
              key={c.title}
              className="card-soft animate-pop p-6"
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              <h2 className="font-display text-xl text-[#4A90A4]">{c.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

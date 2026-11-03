import Link from "next/link";
import type { Metadata } from "next";
import { BRAND, CLASS_HOURS, formatHour } from "@/lib/constants";

export const metadata: Metadata = { title: "Horarios y Políticas" };

export default function HorariosPage() {
  return (
    <div className="bg-brand-wash px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl text-[#4A90A4]">Horarios y Políticas</h1>
          <p className="mt-2 text-ink-soft">
            Clases 1:1 · Q{BRAND.priceGtq} · {BRAND.sessionMinutes} min + 5 min de buffer
          </p>
        </div>

        <section className="card-soft p-6">
          <h2 className="font-display text-2xl text-[#F9A825]">Horarios</h2>
          <p className="mt-2 text-ink-soft">
            Lunes a viernes, zona horaria America/Guatemala. Un niño por bloque.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CLASS_HOURS.map((h) => (
              <li
                key={h}
                className="rounded-full bg-[#E0F7FA] px-4 py-2 text-sm font-bold text-ink"
              >
                {formatHour(h)}
              </li>
            ))}
          </ul>
        </section>

        <section className="card-soft p-6">
          <h2 className="font-display text-2xl text-[#4A90A4]">Pagos</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
            <li>
              <strong>PayPal:</strong> confirmación al instante (modo demo si no hay
              claves).
            </li>
            <li>
              <strong>Transferencia:</strong> puede tardar ~24 h; debe figurar 1 día
              antes de la clase (inmediata: día de clase OK).
            </li>
            <li>
              <strong>Efectivo:</strong> el horario queda apartado; Miss Gali marca
              recibido. Si no está pagado 24 h antes, se libera el cupo.
            </li>
          </ul>
        </section>

        <section className="card-soft p-6">
          <h2 className="font-display text-2xl text-[#4A90A4]">Cancelación</h2>
          <p className="mt-2 text-ink-soft">
            Con ≥24 h de anticipación → crédito de 1 clase (caduca a{" "}
            {BRAND.creditExpiryDays} días). Menos de 24 h o no-show → sin crédito.
            Reembolso PayPal solo si Miss Gali lo aprueba en casos especiales.
          </p>
        </section>

        <section className="card-soft p-6">
          <h2 className="font-display text-2xl text-[#4A90A4]">Feriados</h2>
          <p className="mt-2 text-ink-soft">
            Miss Gali bloquea días en el panel admin. Nos comprometemos a avisar
            con ~30 días de anticipación cuando sea posible.
          </p>
        </section>

        <div className="text-center">
          <Link href="/auth/register" className="btn-primary">
            Reservar una clase
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacidad" };

export default function PrivacidadPage() {
  return (
    <div className="bg-brand-wash px-4 py-12">
      <article className="card-soft mx-auto max-w-3xl p-8">
        <h1 className="font-display text-3xl text-[#4A90A4]">Política de privacidad</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Texto sencillo para familias · {BRAND.name}
        </p>

        <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
          <p>
            Guardamos solo lo necesario para dar clases y juegos: correo del padre
            o tutor, nombre, PIN parental, nombres y edades de los hijos, avatares,
            citas, método/estado de pago, estrellas y tiempo de pantalla.
          </p>
          <p>
            Usamos estos datos para autenticar cuentas, reservar horarios, confirmar
            pagos, personalizar juegos y respetar el límite de 45 minutos diarios.
          </p>
          <p>
            Los niños entran desde la cuenta del padre (“Jugar como…”). No tienen
            contraseña propia; para salir se pide el PIN del padre.
          </p>
          <p>
            No vendemos datos. El acceso admin está limitado a Miss Gali (
            {BRAND.teacher}). Puedes pedir corrección o borrado de tu cuenta por
            WhatsApp {BRAND.whatsappDisplay}.
          </p>
          <p>
            Al registrarte marcas: “Soy padre/tutor y autorizo el uso de datos de
            menores bajo mi cuidado en esta plataforma.”
          </p>
        </div>
      </article>
    </div>
  );
}

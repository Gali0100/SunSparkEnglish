import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Juegos" };

export default async function JuegosGatePage() {
  const session = await auth();

  return (
    <div className="bg-kids-wash px-4 py-12">
      <div className="card-soft mx-auto max-w-2xl p-8 text-center">
        <Image
          src="/logo-sunspark.jpg"
          alt="Sunny"
          width={96}
          height={96}
          className="mx-auto rounded-full ring-4 ring-[#FFF176]"
        />
        <h1 className="font-kids mt-4 text-3xl font-bold text-[#4A90A4]">
          Kids Play Zone
        </h1>
        <p className="mt-3 text-ink-soft">
          Los juegos están en inglés. Entras desde la cuenta de mamá o papá y
          eliges “Jugar como…” tu hijo o hija. Para salir necesitas el PIN de los
          padres.
        </p>
        {session?.user ? (
          <Link href="/kids" className="btn-primary mt-6 inline-block">
            Ir a la zona de juegos
          </Link>
        ) : (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/auth/login?callbackUrl=/kids" className="btn-primary">
              Entrar como padre
            </Link>
            <Link href="/auth/register" className="btn-sky">
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

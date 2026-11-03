import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createStudent } from "@/lib/actions/student-actions";
import Link from "next/link";

export default async function HijosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const students = await prisma.student.findMany({
    where: { parentId: session.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-[#4A90A4]">Perfiles de estudiantes</h1>

      <form
        action={async (fd) => {
          "use server";
          await createStudent(fd);
        }}
        className="card-soft grid gap-3 p-5 sm:grid-cols-3"
      >
        <label className="text-sm font-bold sm:col-span-1">
          Nombre
          <input name="name" className="input-soft mt-1" required />
        </label>
        <label className="text-sm font-bold">
          Edad (6–17)
          <input
            name="age"
            type="number"
            min={6}
            max={17}
            className="input-soft mt-1"
            required
          />
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Agregar
          </button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {students.map((s) => {
          const avatar = JSON.parse(s.avatarJson || "{}") as Record<string, string>;
          return (
            <div key={s.id} className="card-soft p-5">
              <div className="flex items-center gap-4">
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
                  style={{ background: avatar.skin || "#F5CBA7" }}
                >
                  <span
                    className="absolute inset-x-2 top-1 h-4 rounded-t-full"
                    style={{ background: avatar.hair || "#5D4037" }}
                  />
                  <span className="relative z-10 mt-2">{s.name[0]}</span>
                </div>
                <div>
                  <p className="font-extrabold text-lg">{s.name}</p>
                  <p className="text-sm text-ink-soft">
                    {s.age} años · banda {s.ageBand.replace("BAND_", "").replace("_", "–")}
                  </p>
                  <p className="text-sm">⭐ {s.stars} estrellas</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link href={`/kids?student=${s.id}`} className="btn-sky !py-2 text-sm">
                  Jugar como…
                </Link>
                <Link
                  href={`/kids/avatar?student=${s.id}`}
                  className="text-sm font-bold text-[#4A90A4] self-center"
                >
                  Avatar
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

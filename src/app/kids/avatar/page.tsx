import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AvatarBuilder } from "@/components/kids/AvatarBuilder";

export default async function AvatarPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  const sp = await searchParams;

  const student = await prisma.student.findFirst({
    where: { id: sp.student, parentId: session.user.id },
  });
  if (!student) redirect("/kids");

  const initial = JSON.parse(student.avatarJson || "{}") as Record<string, string>;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href={`/kids?student=${student.id}`} className="text-sm font-bold text-[#4A90A4]">
        ← Back to games
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-[#4A90A4]">
        Avatar · {student.name}
      </h1>
      <p className="mb-6 text-sm text-ink-soft">Skin, hair, eyes, clothes & accessories</p>
      <AvatarBuilder studentId={student.id} initial={initial} />
    </div>
  );
}

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "fergie0a04@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "MissGaliAdmin2026!";
  const adminName = process.env.ADMIN_NAME || "Miss Gali";

  const passwordHash = await hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: "ADMIN",
      parentPin: "2468",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "ADMIN",
      parentPin: "2468",
    },
  });

  // Demo parent for local walkthrough
  const demoHash = await hash("padre123", 10);
  const parent = await prisma.user.upsert({
    where: { email: "padre@demo.com" },
    update: {},
    create: {
      email: "padre@demo.com",
      passwordHash: demoHash,
      name: "Ana Demo",
      role: "PARENT",
      parentPin: "1234",
    },
  });

  const existing = await prisma.student.count({ where: { parentId: parent.id } });
  if (existing === 0) {
    await prisma.student.createMany({
      data: [
        {
          parentId: parent.id,
          name: "Mateo",
          age: 8,
          ageBand: "BAND_6_8",
          avatarJson: JSON.stringify({
            skin: "#F5CBA7",
            hair: "#5D4037",
            eyes: "#4A90A4",
            top: "#FFF176",
            accessory: "none",
          }),
          stars: 12,
        },
        {
          parentId: parent.id,
          name: "Sofía",
          age: 11,
          ageBand: "BAND_9_11",
          avatarJson: JSON.stringify({
            skin: "#E0AC69",
            hair: "#F9A825",
            eyes: "#2E7D32",
            top: "#B2EBF2",
            accessory: "bow",
          }),
          stars: 20,
        },
      ],
    });
  }

  console.log("Seed OK");
  console.log(`  Admin: ${admin.email} / (ADMIN_PASSWORD)`);
  console.log(`  Demo parent: padre@demo.com / padre123 (PIN 1234)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

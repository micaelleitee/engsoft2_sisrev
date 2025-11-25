import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // cria labs
  await prisma.lab.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Lab 01 - Informática", capacity: 30, status: "available" },
  });
  await prisma.lab.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Lab 02 - Redes", capacity: 20, status: "available" },
  });

  // cria usuário admin
  const adminEmail = "admin@ifce.edu.br";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin IFCE",
      email: adminEmail,
      password: "senha_temporaria_hash", // substitua por senha hash real se for usar
      role: "admin",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

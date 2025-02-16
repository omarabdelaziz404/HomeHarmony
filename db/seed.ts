import { PrismaClient } from "@prisma/client";
import ikeaProducts from "./sample-data";

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: ikeaProducts.products });

  await prisma.user.createMany({ data: ikeaProducts.users });

  console.log("Database seeded succesfully!");
}

main();

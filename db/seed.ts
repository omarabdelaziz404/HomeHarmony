import { PrismaClient } from "@prisma/client";
import ikeaProducts from "./sample-data";

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: ikeaProducts.products });

  console.log("Database seeded succesfully!");
}

main();

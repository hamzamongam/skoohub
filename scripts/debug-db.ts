
import { prisma } from "../src/db/prisma";

async function main() {
  const verifications = await prisma.verification.findMany({
    take: 5,
    orderBy: { expiresAt: 'desc' }
  });
  console.log("Verifications:", verifications);
}

main();

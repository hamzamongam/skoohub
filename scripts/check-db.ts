import { prisma } from "../src/db/prisma";

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Users:", users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, schoolId: u.schoolId })));
  console.log("Schools:", schools.map(s => ({ id: s.id, name: s.name, slug: s.slug, onboardingStatus: s.onboardingStatus })));
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')
  console.log('✅ Seeding completed successfully (no pre-seeded data needed for this layout)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

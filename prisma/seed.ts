import { PrismaClient } from 'src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.user.create({
    data: {
      email: 'admin@email.com',
      password: '123456',
    },
  });

  console.log('✅ Seed finalizado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

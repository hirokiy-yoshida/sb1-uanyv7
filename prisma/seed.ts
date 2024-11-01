import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'システム管理者',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: '山田 太郎',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create rooms
  const roomA = await prisma.room.create({
    data: {
      name: '大会議室 A',
      capacity: 20,
      type: 'CONNECTED',
    },
  });

  await prisma.room.create({
    data: {
      name: '大会議室 B',
      capacity: 20,
      type: 'CONNECTED',
      connectedToId: roomA.id,
    },
  });

  await prisma.room.create({
    data: {
      name: '中会議室 C',
      capacity: 12,
      type: 'SINGLE',
    },
  });

  // Create holidays
  await prisma.holiday.create({
    data: {
      date: new Date('2024-01-01'),
      name: '元日',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
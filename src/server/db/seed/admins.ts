import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { admins } from '@/server/db/schema/admins';

interface SeedAdminsConfig {
  count?: number;
}

export async function seedAdmins(config: SeedAdminsConfig = {}) {
  console.log('👨‍💼 Seeding admins...');

  const { count = 5 } = config;

  const adminRecords = [];

  for (let i = 0; i < count; i++) {
    adminRecords.push({
      authUserId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const insertedAdmins = await db.insert(admins).values(adminRecords).returning();

  console.log(`✅ Seeded ${insertedAdmins.length} admins`);

  return insertedAdmins;
}

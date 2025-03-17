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
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    adminRecords.push({
      authUserId: faker.string.uuid(),
      firstName: firstName,
      lastName: lastName,
      displayName: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    });
  }

  const insertedAdmins = await db.insert(admins).values(adminRecords).returning();

  console.log(`✅ Seeded ${insertedAdmins.length} admins`);

  return insertedAdmins;
}
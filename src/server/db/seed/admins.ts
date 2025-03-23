import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { admins } from '@/server/db/schema/admins';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

interface SeedAdminsConfig {
  count?: number;
  existingUsers?: any[];
}

export async function seedAdmins(config: SeedAdminsConfig = {}) {
  console.log('👨‍💼 Seeding admins...');

  const { count = 5, existingUsers = [] } = config;

  // Get user IDs from existing users or database
  let userIds = [];

  if (existingUsers.length > 0) {
    const adminUsers = existingUsers.filter((user) => user.role === 'admin');

    if (adminUsers.length > 0) {
      console.log(`Using ${adminUsers.length} existing admin users from user seeding`);
      userIds = adminUsers.map((user) => user.id);
    }
  }

  if (userIds.length < count) {
    const dbAdminUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(count - userIds.length);
    userIds = [...userIds, ...dbAdminUsers.map((user) => user.id)];
  }

  // Adjust count based on available valid user IDs
  const adjustedCount = Math.min(count, userIds.length);

  if (adjustedCount < count) {
    console.warn(`Not enough valid admin user IDs. Creating ${adjustedCount} admins instead of ${count}.`);
  }

  if (adjustedCount === 0) {
    console.warn('No valid admin user IDs found. Cannot create any admin records.');
    return [];
  }

  const adminRecords = [];

  for (let i = 0; i < adjustedCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // Use ONLY valid user IDs from the array
    const userId = userIds[i];

    console.log(`Creating admin with user ID: ${userId}`);

    adminRecords.push({
      userId: userId,
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

  if (adminRecords.length === 0) {
    console.log('No admin records to insert.');
    return [];
  }

  const insertedAdmins = await db.insert(admins).values(adminRecords).returning();

  console.log(`✅ Seeded ${insertedAdmins.length} admins`);

  return insertedAdmins;
}

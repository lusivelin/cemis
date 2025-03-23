import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { teachers } from '@/server/db/schema/teachers';

interface SeedTeachersConfig {
  count?: number;
  departments?: string[];
  designations?: string[];
  existingUsers?: any[];
}

export async function seedTeachers(config: SeedTeachersConfig = {}) {
  console.log('👨‍🏫 Seeding teachers...');

  const {
    count = 30,
    departments = [
      'Computer Science',
      'Engineering',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Business Administration',
      'English',
      'History',
    ],
    designations = [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Senior Lecturer',
      'Lecturer',
      'Visiting Faculty',
      'Department Head',
    ],
    existingUsers = [],
  } = config;

  const userIdsFromExisting = existingUsers.map((user) => user.id);

  console.log(`Found ${userIdsFromExisting.length} user IDs from existing users for teachers`);

  const adjustedCount = Math.min(count, userIdsFromExisting.length);

  if (adjustedCount < count) {
    console.warn(`Not enough user IDs available. Creating ${adjustedCount} teachers instead of ${count}.`);
  }

  if (adjustedCount === 0) {
    console.warn('No valid user IDs found. Cannot create any teacher records.');
    return [];
  }

  const teacherRecords = [];

  for (let i = 0; i < adjustedCount; i++) {
    try {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const designation = faker.helpers.arrayElement(designations);
      const displayName = `${designation} ${firstName} ${lastName}`;

      const department = faker.helpers.arrayElement(departments);
      const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other', 'Prefer not to say']);

      const userId = userIdsFromExisting[i];

      console.log(`Creating teacher with user ID: ${userId}`);

      teacherRecords.push({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number(),
        gender: gender,
        dateOfBirth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
        department: department,
        designation: designation,
        createdAt: faker.date.past({ years: 3 }),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating teacher record:', error);
    }
  }

  if (teacherRecords.length === 0) {
    console.log('No teacher records to insert.');
    return [];
  }

  const insertedTeachers = await db.insert(teachers).values(teacherRecords).returning();

  console.log(`✅ Seeded ${insertedTeachers.length} teachers`);

  return insertedTeachers;
}

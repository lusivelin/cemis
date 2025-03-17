import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { teachers } from '@/server/db/schema/teachers';

interface SeedTeachersConfig {
  count?: number;
  departments?: string[];
  designations?: string[];
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
  } = config;

  const teacherRecords = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    const designation = faker.helpers.arrayElement(designations);
    const displayName = `${designation} ${firstName} ${lastName}`;
    
    const department = faker.helpers.arrayElement(departments);
    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other', 'Prefer not to say']);
    
    teacherRecords.push({
      authUserId: faker.string.uuid(),
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
  }

  const insertedTeachers = await db.insert(teachers).values(teacherRecords).returning();

  console.log(`✅ Seeded ${insertedTeachers.length} teachers`);

  return insertedTeachers;
}
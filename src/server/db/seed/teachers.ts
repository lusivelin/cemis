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
      'History'
    ],
    designations = [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Senior Lecturer',
      'Lecturer',
      'Visiting Faculty',
      'Department Head'
    ]
  } = config;

  const teacherRecords = [];

  for (let i = 0; i < count; i++) {
    teacherRecords.push({
      authUserId: faker.string.uuid(),
      department: faker.helpers.arrayElement(departments),
      designation: faker.helpers.arrayElement(designations),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const insertedTeachers = await db
    .insert(teachers)
    .values(teacherRecords)
    .returning();

  console.log(`✅ Seeded ${insertedTeachers.length} teachers`);
  
  return insertedTeachers;
}
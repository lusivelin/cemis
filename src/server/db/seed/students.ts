import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { students } from '@/server/db/schema/students';

interface SeedStudentsConfig {
  count?: number;
  startingBatch?: number;
  programs?: string[];
}

export async function seedStudents(config: SeedStudentsConfig = {}) {
  console.log('👨‍🎓 Seeding students...');

  const {
    count = 50,
    startingBatch = new Date().getFullYear(),
    programs = ['Computer Science', 'Engineering', 'Business', 'Mathematics', 'Physics']
  } = config;

  const studentRecords = [];

  for (let i = 0; i < count; i++) {
    const batch = startingBatch - faker.number.int({ min: 0, max: 3 });

    studentRecords.push({
      authUserId: faker.string.uuid(),
      batch,
      program: faker.helpers.arrayElement(programs),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Insert all students in a single batch operation
  const insertedStudents = await db
    .insert(students)
    .values(studentRecords)
    .returning();

  console.log(`✅ Seeded ${insertedStudents.length} students`);
  
  return insertedStudents;
}
import { db } from '..';
import { faker } from '@faker-js/faker';
import { teachers } from '@/backend/db/schema/teacher';
import { users } from '@/backend/db/schema/auth';

const designations = ['Professor', 'Assistant Professor', 'Lecturer', 'Senior Lecturer', 'Instructor'];
const departments = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

export async function seedTeachers(count: number = 20) {
  try {
    console.log('Starting teacher seeding...');

    // Fetch all available user IDs
    const userResult = await db.select({ id: users.id }).from(users);
    const userIds = userResult.map((u) => u.id);

    if (userIds.length === 0) {
      throw new Error('No users found in the database. Please seed users first.');
    }

    // Generate teacher data
    const teachersData = userIds.slice(0, count).map((userId) => ({
      id: faker.number.int(10000),
      userId,
      department: faker.helpers.arrayElement(departments),
      designation: faker.helpers.arrayElement(designations),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await db.insert(teachers).values(teachersData);

    console.log(`Successfully seeded ${teachersData.length} teachers`);
  } catch (error) {
    console.error('Error seeding teachers:', error);
    throw error;
  }
}

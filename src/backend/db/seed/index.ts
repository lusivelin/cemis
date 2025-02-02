import { courses } from '../schema/course';
import { seedCourses } from './course';
import { db } from '@/backend/db';

async function seedDatabase() {
  try {
    await db.delete(courses);
    await seedCourses(2);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

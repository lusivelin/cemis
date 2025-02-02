import { courses } from '@/backend/db/schema/course';
import { teachers } from '@/backend/db/schema/teacher';
import { seedCourses } from './course';
import { db } from '@/backend/db';
import { seedTeachers } from './teacher';

async function seedDatabase() {
  try {
    await db.delete(courses);
    await db.delete(teachers);
    await seedTeachers(5);
    await seedCourses(30);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

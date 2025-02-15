import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { courses } from '@/server/db/schema/courses';

interface SeedCoursesConfig {
  count?: number;
  teacherIds: string[];
  courseCodePrefix?: string;
}

export async function seedCourses(config: SeedCoursesConfig) {
  console.log('📚 Seeding courses...');

  if (!config.teacherIds?.length) {
    throw new Error('Teacher IDs are required to seed courses');
  }

  const {
    count = 40,
    teacherIds,
    courseCodePrefix = 'CS'
  } = config;

  const courseSubjects = [
    'Introduction to',
    'Advanced',
    'Fundamentals of',
    'Topics in',
    'Principles of',
    'Applied',
    'Research Methods in',
    'Seminar in'
  ];

  const courseTopics = [
    'Programming',
    'Data Structures',
    'Algorithms',
    'Database Systems',
    'Software Engineering',
    'Computer Networks',
    'Operating Systems',
    'Machine Learning',
    'Artificial Intelligence',
    'Web Development',
    'Mobile Computing',
    'Computer Architecture',
    'Information Security',
    'Cloud Computing'
  ];

  const courseRecords = [];

  for (let i = 0; i < count; i++) {
    const courseLevel = faker.number.int({ min: 1, max: 4 }) * 100;
    const courseNumber = faker.number.int({ min: 1, max: 99 }).toString().padStart(2, '0');
    const code = `${courseCodePrefix}${courseLevel}${courseNumber}`;

    const subject = faker.helpers.arrayElement(courseSubjects);
    const topic = faker.helpers.arrayElement(courseTopics);
    const name = `${subject} ${topic}`;

    courseRecords.push({
      teacherId: faker.helpers.arrayElement(teacherIds),
      credits: faker.number.int({ min: 1, max: 4 }),
      code,
      name,
      description: faker.lorem.paragraph(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const insertedCourses = await db
    .insert(courses)
    .values(courseRecords)
    .returning();

  console.log(`✅ Seeded ${insertedCourses.length} courses`);
  
  return insertedCourses;
}

export async function seedDepartmentCourses(teacherIds: string[], department: string) {
  const departmentPrefixes: Record<string, string> = {
    'Computer Science': 'CS',
    'Mathematics': 'MATH',
    'Physics': 'PHYS',
    'Engineering': 'ENG',
    'Chemistry': 'CHEM',
    'Business Administration': 'BUS',
    'English': 'ENG',
    'History': 'HIST'
  };

  return seedCourses({
    teacherIds,
    courseCodePrefix: departmentPrefixes[department] || department.substring(0, 4).toUpperCase(),
    count: faker.number.int({ min: 5, max: 15 }) // Random number of courses per department
  });
}
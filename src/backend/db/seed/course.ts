import { db } from '..';
import { faker } from '@faker-js/faker';
import { courses } from '../schema/course';
import { teachers } from '../schema/teacher';

const generateCourseCode = (department: string, level: number): string => {
  const courseNumber = faker.number.int({ min: 100, max: 499 });
  return `${department}${courseNumber}`;
};

const departments = [
  { code: 'CS', name: 'Computer Science' },
  { code: 'MATH', name: 'Mathematics' },
  { code: 'PHY', name: 'Physics' },
  { code: 'CHEM', name: 'Chemistry' },
  { code: 'BIO', name: 'Biology' },
  { code: 'ENG', name: 'English' },
  { code: 'HIST', name: 'History' },
  { code: 'ECON', name: 'Economics' },
];

const descriptionTemplates = [
  'This course introduces students to the fundamental concepts of {subject}. Through practical exercises and theoretical study, students will develop a strong foundation in {topic}.',
  'An advanced exploration of {subject}, focusing on {topic}. Students will engage in hands-on projects and critical analysis.',
  'A comprehensive study of {subject} principles, with emphasis on {topic}. Includes laboratory work and real-world applications.',
  'This course provides an in-depth examination of {subject}, covering both traditional and contemporary approaches to {topic}.',
];

interface CourseData {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  teacherId: number;
}

async function generateCourseData(teacherIds: number[]): Promise<CourseData> {
  const department = faker.helpers.arrayElement(departments);
  const level = faker.number.int({ min: 1, max: 4 });
  const courseCode = generateCourseCode(department.code, level);

  const subject = department.name;
  const topic = faker.helpers.arrayElement([
    'theoretical foundations',
    'practical applications',
    'advanced concepts',
    'modern techniques',
    'research methodologies',
    'industry practices',
  ]);

  const description = faker.helpers
    .arrayElement(descriptionTemplates)
    .replace('{subject}', subject)
    .replace('{topic}', topic);
  return {
    id: faker.number.int(10000),
    courseCode,
    courseName: `${faker.word.adjective()} ${subject} ${level}`,
    description,
    credits: faker.helpers.arrayElement([3, 4, 6]),
    teacherId: faker.helpers.arrayElement(teacherIds),
  };
}

export async function seedCourses(count: number = 50) {
  try {
    console.log('Starting course seeding...');

    // First, get all teacher IDs
    const teacherResult = await db.select({ id: teachers.id }).from(teachers);
    const teacherIds = teacherResult.map((t) => t.id);

    if (teacherIds.length === 0) {
      throw new Error('No teachers found in the database. Please seed teachers first.');
    }

    // Generate course data
    const coursesData: CourseData[] = [];
    const usedCodes = new Set();

    for (let i = 0; i < count; i++) {
      let courseData: CourseData;
      do {
        courseData = await generateCourseData(teacherIds);
      } while (usedCodes.has(courseData.courseCode));

      usedCodes.add(courseData.courseCode);
      coursesData.push(courseData);
    }

    // Insert courses in batches
    const batchSize = 10;
    for (let i = 0; i < coursesData.length; i += batchSize) {
      const batch = coursesData.slice(i, i + batchSize);
      await db.insert(courses).values(batch);
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(coursesData.length / batchSize)}`);
    }

    console.log(`Successfully seeded ${count} courses`);
  } catch (error) {
    console.error('Error seeding courses:', error);
    throw error;
  }
}

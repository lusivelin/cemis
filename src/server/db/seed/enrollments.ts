import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { enrollments } from '@/server/db/schema/enrollments';

interface SeedEnrollmentsConfig {
  studentIds: string[];
  courseIds: string[];
  semester?: string;
  enrollmentDate?: {
    start: Date;
    end: Date;
  };
  enrollmentsPerStudent?: {
    min: number;
    max: number;
  };
}

export async function seedEnrollments(config: SeedEnrollmentsConfig) {
  console.log('📚 Seeding enrollments...');

  if (!config.studentIds?.length || !config.courseIds?.length) {
    throw new Error('Student IDs and Course IDs are required to seed enrollments');
  }

  const {
    studentIds,
    courseIds,
    semester = getCurrentSemester(),
    enrollmentDate = {
      start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
      end: new Date(),
    },
    enrollmentsPerStudent = { min: 3, max: 6 },
  } = config;

  const enrollmentRecords = [];

  for (const studentId of studentIds) {
    const numEnrollments = faker.number.int({
      min: enrollmentsPerStudent.min,
      max: enrollmentsPerStudent.max,
    });

    const selectedCourses = faker.helpers.shuffle([...courseIds]).slice(0, numEnrollments);

    for (const courseId of selectedCourses) {
      const enrolledAt = faker.date.between({
        from: enrollmentDate.start,
        to: enrollmentDate.end,
      });

      enrollmentRecords.push({
        studentId,
        courseId,
        enrolledAt: enrolledAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
        semester,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  enrollmentRecords.sort((a, b) => new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime());

  const insertedEnrollments = await db.insert(enrollments).values(enrollmentRecords).returning();

  console.log(`✅ Seeded ${insertedEnrollments.length} enrollments`);

  return insertedEnrollments;
}

function getCurrentSemester(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 1 && month <= 5) {
    return `Spring ${year}`;
  } else if (month >= 6 && month <= 8) {
    return `Summer ${year}`;
  } else {
    return `Fall ${year}`;
  }
}

export async function seedSemesterEnrollments(
  studentIds: string[],
  courseIds: string[],
  semesterConfig: {
    semester: string;
    enrollmentPeriod: {
      start: Date;
      end: Date;
    };
    enrollmentsPerStudent?: {
      min: number;
      max: number;
    };
  }
) {
  return seedEnrollments({
    studentIds,
    courseIds,
    semester: semesterConfig.semester,
    enrollmentDate: semesterConfig.enrollmentPeriod,
    enrollmentsPerStudent: semesterConfig.enrollmentsPerStudent,
  });
}

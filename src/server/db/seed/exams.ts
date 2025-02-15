import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { exams } from '@/server/db/schema/exams';

interface SeedExamsConfig {
  courseIds: string[];
  examsPerCourse?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export async function seedExams(config: SeedExamsConfig) {
  console.log('📝 Seeding exams...');

  if (!config.courseIds?.length) {
    throw new Error('Course IDs are required to seed exams');
  }

  const {
    courseIds,
    examsPerCourse = { min: 2, max: 4 },
    dateRange = {
      start: new Date(),
      end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days from now
    },
  } = config;

  const examTypes = ['Midterm', 'Final', 'Quiz', 'Practical', 'Oral', 'Written'];

  const examDurations = [60, 90, 120, 150, 180];
  const examMarks = [50, 75, 100, 150, 200];

  const examRecords = [];

  for (const courseId of courseIds) {
    const numExams = faker.number.int({
      min: examsPerCourse.min,
      max: examsPerCourse.max,
    });

    const courseExamTypes = faker.helpers.shuffle([...examTypes]).slice(0, numExams);

    for (let i = 0; i < numExams; i++) {
      const examDate = faker.date.between({
        from: dateRange.start,
        to: dateRange.end,
      });

      examRecords.push({
        courseId,
        examType: courseExamTypes[i],
        examDate: examDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        duration: faker.helpers.arrayElement(examDurations),
        totalMarks: faker.helpers.arrayElement(examMarks),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  examRecords.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const insertedExams = await db.insert(exams).values(examRecords).returning();

  console.log(`✅ Seeded ${insertedExams.length} exams`);

  return insertedExams;
}

export async function seedTermExams(
  courseIds: string[],
  termConfig: {
    startDate: Date;
    endDate: Date;
    examsPerCourse?: {
      min: number;
      max: number;
    };
  }
) {
  return seedExams({
    courseIds,
    dateRange: {
      start: termConfig.startDate,
      end: termConfig.endDate,
    },
    examsPerCourse: termConfig.examsPerCourse,
  });
}

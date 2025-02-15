import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { assignments } from '@/server/db/schema/assignments';

interface SeedAssignmentsConfig {
  courseIds: string[];
  assignmentsPerCourse?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export async function seedAssignments(config: SeedAssignmentsConfig) {
  console.log('📝 Seeding assignments...');

  if (!config.courseIds?.length) {
    throw new Error('Course IDs are required to seed assignments');
  }

  const {
    courseIds,
    assignmentsPerCourse = { min: 3, max: 6 },
    dateRange = {
      start: new Date(),
      end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120), // 120 days from now
    },
  } = config;

  const assignmentTypes = [
    'Project',
    'Homework',
    'Lab Report',
    'Case Study',
    'Research Paper',
    'Problem Set',
    'Programming Assignment',
    'Essay',
    'Presentation',
    'Final Report',
  ];

  const assignmentRecords = [];

  for (const courseId of courseIds) {
    const numAssignments = faker.number.int({
      min: assignmentsPerCourse.min,
      max: assignmentsPerCourse.max,
    });

    for (let i = 0; i < numAssignments; i++) {
      const assignmentType = faker.helpers.arrayElement(assignmentTypes);
      const assignmentNumber = i + 1;

      const dueDate = faker.date.between({
        from: dateRange.start,
        to: dateRange.end,
      });

      assignmentRecords.push({
        courseId,
        title: `${assignmentType} ${assignmentNumber}`,
        description: faker.lorem.paragraphs(2),
        dueDate: dueDate.toISOString(),
        totalMarks: faker.helpers.arrayElement(['10', '20', '25', '30', '40', '50', '100']),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  assignmentRecords.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const insertedAssignments = await db.insert(assignments).values(assignmentRecords).returning();

  console.log(`✅ Seeded ${insertedAssignments.length} assignments`);

  return insertedAssignments;
}

// Helper function to generate assignments for an academic term
export async function seedTermAssignments(
  courseIds: string[],
  termConfig: {
    startDate: Date;
    endDate: Date;
  }
) {
  return seedAssignments({
    courseIds,
    dateRange: {
      start: termConfig.startDate,
      end: termConfig.endDate,
    },
    assignmentsPerCourse: {
      min: 4,
      max: 8,
    },
  });
}

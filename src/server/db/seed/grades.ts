import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { grades } from '@/server/db/schema/grades';

interface SeedGradesConfig {
  studentIds: string[];
  courseIds: string[];
  assignmentIds: { id: string; courseId: string | null; totalMarks: string }[];
  examIds: { id: string; courseId: string | null; totalMarks: number }[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const calculateLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export async function seedGrades({
  studentIds,
  courseIds,
  assignmentIds,
  examIds,
  dateRange = {
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    end: new Date(),
  },
}: SeedGradesConfig) {
  console.log('📊 Seeding grades...');

  const BATCH_SIZE = 100;
  let totalInserted = 0;

  // Process assignments
  console.log('Processing assignment grades...');
  for (const assignment of assignmentIds) {
    const gradeRecords = [];
    const totalMarks = parseInt(assignment.totalMarks);
    const meanScore = totalMarks * 0.8;
    const stdDev = totalMarks * 0.1;

    for (const studentId of studentIds) {
      let marks = Math.round(
        faker.number.int({
          min: Math.max(0, meanScore - 2 * stdDev),
          max: Math.min(totalMarks, meanScore + 2 * stdDev),
        })
      );

      const percentage = (marks / totalMarks) * 100;

      gradeRecords.push({
        courseId: assignment.courseId,
        studentId,
        assignmentId: assignment.id,
        examId: null,
        grade: calculateLetterGrade(percentage),
        gradedAt: faker.date
          .between({
            from: dateRange.start,
            to: dateRange.end,
          })
          .toISOString()
          .split('T')[0],
        marks: marks.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (gradeRecords.length >= BATCH_SIZE) {
        const inserted = await db.insert(grades).values(gradeRecords).returning();
        totalInserted += inserted.length;
        gradeRecords.length = 0;
        console.log(`Inserted ${totalInserted} grades so far...`);
      }
    }

    // Insert remaining records
    if (gradeRecords.length > 0) {
      const inserted = await db.insert(grades).values(gradeRecords).returning();
      totalInserted += inserted.length;
    }
  }

  // Process exams
  console.log('Processing exam grades...');
  for (const exam of examIds) {
    const gradeRecords = [];
    const totalMarks = exam.totalMarks;
    const meanScore = totalMarks * 0.75;
    const stdDev = totalMarks * 0.15;

    for (const studentId of studentIds) {
      let marks = Math.round(
        faker.number.int({
          min: Math.max(0, meanScore - 2 * stdDev),
          max: Math.min(totalMarks, meanScore + 2 * stdDev),
        })
      );

      const percentage = (marks / totalMarks) * 100;

      gradeRecords.push({
        courseId: exam.courseId,
        studentId,
        assignmentId: null,
        examId: exam.id,
        grade: calculateLetterGrade(percentage),
        gradedAt: faker.date
          .between({
            from: dateRange.start,
            to: dateRange.end,
          })
          .toISOString()
          .split('T')[0],
        marks: marks.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (gradeRecords.length >= BATCH_SIZE) {
        const inserted = await db.insert(grades).values(gradeRecords).returning();
        totalInserted += inserted.length;
        gradeRecords.length = 0;
        console.log(`Inserted ${totalInserted} grades so far...`);
      }
    }

    // Insert remaining records
    if (gradeRecords.length > 0) {
      const inserted = await db.insert(grades).values(gradeRecords).returning();
      totalInserted += inserted.length;
    }
  }

  console.log(`✅ Seeded ${totalInserted} grades`);
  return totalInserted;
}
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

export async function seedGrades({
  studentIds,
  courseIds,
  assignmentIds,
  examIds,
  dateRange = {
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    end: new Date(),
  },
}: SeedGradesConfig) {
  console.log('📊 Seeding grades...');

  const gradeRecords = [];

  const calculateLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  for (const assignment of assignmentIds) {
    for (const studentId of studentIds) {
      const totalMarks = parseInt(assignment.totalMarks);

      const meanScore = totalMarks * 0.8;
      const stdDev = totalMarks * 0.1;
      let marks = Math.round(
        faker.number.int({
          min: meanScore - 2 * stdDev,
          max: meanScore + 2 * stdDev,
        })
      );
      marks = Math.min(Math.max(marks, 0), totalMarks);

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
    }
  }

  for (const exam of examIds) {
    for (const studentId of studentIds) {
      const totalMarks = exam.totalMarks;

      const meanScore = totalMarks * 0.75;
      const stdDev = totalMarks * 0.15;
      let marks = Math.round(
        faker.number.int({
          min: meanScore - 2 * stdDev,
          max: meanScore + 2 * stdDev,
        })
      );
      marks = Math.min(Math.max(marks, 0), totalMarks);

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
    }
  }

  gradeRecords.sort((a, b) => new Date(a.gradedAt).getTime() - new Date(b.gradedAt).getTime());

  const insertedGrades = await db.insert(grades).values(gradeRecords).returning();

  console.log(`✅ Seeded ${insertedGrades.length} grades`);

  return insertedGrades;
}

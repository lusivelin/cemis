import { pgTable, uuid, text, date } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { courses } from './courses';
import { students } from './students';
import { assignments } from './assignments';
import { exams } from './exams';

export const grades = pgTable('grades', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id),
  studentId: uuid('student_id').references(() => students.id),
  assignmentId: uuid('assignment_id').references(() => assignments.id),
  examId: uuid('exam_id').references(() => exams.id),

  grade: text('grade'),
  gradedAt: date('graded_at'),

  marks: text('marks'),
  ...timestamps,
});

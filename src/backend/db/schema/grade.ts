import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { students } from './student';
import { courses } from './course';
import { assignments } from './assignment';
import { exams } from './exam';
import { timestamps } from './timestamp';

export const grades = pgTable('grades', {
  id: integer('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  courseId: integer('course_id').references(() => courses.id),
  assignmentId: integer('assignment_id').references(() => assignments.id),
  examId: integer('exam_id').references(() => exams.id),
  marks: integer('marks').notNull(),
  grade: varchar('grade').notNull(),
  gradedAt: timestamp('graded_at').defaultNow(),
  ...timestamps,
});

export const gradeRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [grades.courseId],
    references: [courses.id],
  }),
  assignment: one(assignments, {
    fields: [grades.assignmentId],
    references: [assignments.id],
  }),
  exam: one(exams, {
    fields: [grades.examId],
    references: [exams.id],
  }),
}));

import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { students } from './student';
import { courses } from './course';

export const enrollments = pgTable('enrollments', {
  id: integer('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  courseId: integer('course_id').references(() => courses.id),
  semester: varchar('semester').notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
});

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

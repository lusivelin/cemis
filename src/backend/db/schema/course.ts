import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { teachers } from './teacher';
import { assignments } from './assignment';
import { exams } from './exam';
import { enrollments } from './enrollment';
import { timestamps } from './timestamp';

export const courses = pgTable('courses', {
  id: integer('id').primaryKey(),
  courseCode: varchar('course_code').notNull().unique(),
  courseName: varchar('course_name').notNull(),
  description: text('description'),
  credits: integer('credits').notNull(),
  teacherId: integer('teacher_id').references(() => teachers.id),
  ...timestamps,
});

export const courseRelations = relations(courses, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  assignments: many(assignments),
  exams: many(exams),
  enrollments: many(enrollments),
}));

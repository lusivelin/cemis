import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { courses } from './course';
import { grades } from './grade';
import { submissions } from './submission';
import { timestamps } from './timestamp';

export const assignments = pgTable('assignments', {
  id: integer('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  title: varchar('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  totalMarks: integer('total_marks').notNull(),
  ...timestamps,
});

export const assignmentRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  submissions: many(submissions),
  grades: many(grades),
}));

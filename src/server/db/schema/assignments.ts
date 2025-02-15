import { pgTable, uuid, text, date } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { courses } from './courses';

export const assignments = pgTable('assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id),
  title: text('title').notNull(),
  description: text('description').notNull(),

  dueDate: date('due_date').notNull(),
  totalMarks: text('total_marks').notNull(),
  ...timestamps,
});

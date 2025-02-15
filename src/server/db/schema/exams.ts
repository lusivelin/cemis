import { pgTable, uuid, text, date, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { courses } from './courses';

export const exams = pgTable('exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id),

  examType: text('exam_type').notNull(),
  examDate: date('exam_date').notNull(),
  duration: integer('duration').notNull(),
  totalMarks: integer('total_marks').notNull(),
  ...timestamps,
});
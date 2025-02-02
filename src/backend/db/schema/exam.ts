import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { courses } from './course';
import { grades } from './grade';
import { timestamps } from './timestamp';

export const exams = pgTable('exams', {
  id: integer('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  examType: varchar('exam_type').notNull(),
  examDate: timestamp('exam_date').notNull(),
  duration: integer('duration').notNull(),
  totalMarks: integer('total_marks').notNull(),
  ...timestamps,
});

export const examRelations = relations(exams, ({ one, many }) => ({
  course: one(courses, {
    fields: [exams.courseId],
    references: [courses.id],
  }),
  grades: many(grades),
}));

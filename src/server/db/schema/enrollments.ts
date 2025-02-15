import { pgTable, uuid, text, date } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { students } from './students';
import { courses } from './courses';

export const enrollments = pgTable('enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => students.id),
  courseId: uuid('course_id').references(() => courses.id),

  enrolledAt: date('enrolled_at').notNull(),
  semester: text('semester').notNull(),
  ...timestamps,
});

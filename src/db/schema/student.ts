import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { enrollments } from './enrollment';
import { grades } from './grade';
import { attendances } from './attendance';

export const students = pgTable('students', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  studentId: varchar('student_id').notNull().unique(),
  program: varchar('program').notNull(),
  batch: integer('batch').notNull(),
});

export const studentRelations = relations(students, ({ many, one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  attendances: many(attendances),
  grades: many(grades),
}));

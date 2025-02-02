import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { courses } from './course';
import { timestamps } from './timestamp';

export const teachers = pgTable('teachers', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  department: varchar('department').notNull(),
  designation: varchar('designation').notNull(),
  ...timestamps,
});

export const teacherRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  courses: many(courses),
}));

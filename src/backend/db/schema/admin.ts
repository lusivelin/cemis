import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';
import { courses } from './course';
import { timestamps } from './timestamp';

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  department: varchar('department').notNull(),
  accessLevel: varchar('access_level').notNull(), // e.g., 'super_admin', 'course_admin'
  ...timestamps,
});

export const adminRelations = relations(admins, ({ one, many }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
  managedCourses: many(courses),
  managedUsers: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
}));

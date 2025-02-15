import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { teachers } from './teachers';

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherId: uuid('teacher_id').references(() => teachers.id),

  credits: integer('credits').notNull(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  ...timestamps,
});
import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  batch: integer('batch').notNull(),
  program: text('program').notNull(),
  ...timestamps,
});
import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const teachers = pgTable('teachers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  department: text('department').notNull(),
  designation: text('designation').notNull(),
  ...timestamps,
});
import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const teachers = pgTable('teachers', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id'),
  department: text('department').notNull(),
  designation: text('designation').notNull(),
  ...timestamps,
});

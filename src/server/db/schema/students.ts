import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id'),
  batch: integer('batch').notNull(),
  program: text('program').notNull(),
  ...timestamps,
});

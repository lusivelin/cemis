import { pgTable, text, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const roleEnum = pgEnum('role', ['admin', 'student', 'teacher']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id').notNull().unique(),
  role: roleEnum('role').notNull(),
  ...timestamps,
});

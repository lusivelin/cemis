import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id'),
  ...timestamps
});
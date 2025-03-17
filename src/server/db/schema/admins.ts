import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id'),

  // Admin personal information
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  displayName: text('display_name'),
  email: text('email').notNull(),
  phone: text('phone'),

  // Additional metadata
  notes: text('notes'),
  ...timestamps,
});

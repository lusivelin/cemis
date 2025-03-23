import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { users } from './users';

export const admins = pgTable(
  'admins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),

    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    displayName: text('display_name'),
    email: text('email').notNull(),
    phone: text('phone'),

    notes: text('notes'),
    ...timestamps,
  },
  (table) => [unique().on(table.userId)]
);

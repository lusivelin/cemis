import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const qualificationEnum = pgEnum('qualification', [
  'bachelors',
  'masters',
  'phd',
  'post_doc',
  'professor'
]);

export const teachers = pgTable('teachers', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  displayName: text('display_name'),
  email: text('email').notNull(),
  phone: text('phone'),
  gender: text('gender'),
  dateOfBirth: timestamp('date_of_birth'),
  department: text('department').notNull(),
  designation: text('designation').notNull(),
  ...timestamps,
});

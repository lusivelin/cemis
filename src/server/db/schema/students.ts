import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: uuid('auth_user_id'),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  displayName: text('display_name'),
  email: text('email').notNull(),
  phone: text('phone'),
  gender: text('gender'),
  dateOfBirth: timestamp('date_of_birth'),
  placeOfBirth: text('place_of_birth'),
  nationality: text('nationality'),

  currentAddress: text('current_address'),
  permanentAddress: text('permanent_address'),

  guardianName: text('guardian_name'),
  guardianRelationship: text('guardian_relationship'),
  guardianPhone: text('guardian_phone'),
  guardianEmail: text('guardian_email'),

  batch: integer('batch').notNull(),
  program: text('program').notNull(),
  ...timestamps,
});

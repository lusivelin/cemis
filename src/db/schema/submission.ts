import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { assignments } from './assignment';
import { students } from './student';

export const submissions = pgTable('submissions', {
  id: integer('id').primaryKey(),
  assignmentId: integer('assignment_id').references(() => assignments.id),
  studentId: integer('student_id').references(() => students.id),
  submissionUrl: varchar('submission_url').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
  status: varchar('status').notNull(),
  feedback: text('feedback'),
  isLate: boolean('is_late').default(false),
});

export const submissionRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(students, {
    fields: [submissions.studentId],
    references: [students.id],
  }),
}));

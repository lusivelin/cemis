import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { students } from './student';
import { courses } from './course';

export const attendances = pgTable('attendances', {
  id: integer('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  courseId: integer('course_id').references(() => courses.id),
  attendanceDate: timestamp('attendance_date').notNull(),
  status: varchar('status').notNull(),
});

export const attendanceRelations = relations(attendances, ({ one }) => ({
  student: one(students, {
    fields: [attendances.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [attendances.courseId],
    references: [courses.id],
  }),
}));

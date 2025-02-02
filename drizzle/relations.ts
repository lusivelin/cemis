import { relations } from "drizzle-orm/relations";
import { user, session, authenticator, teachers, courses, students, assignments, submissions, exams, grades, attendances, enrollments, account, admins } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	authenticators: many(authenticator),
	students: many(students),
	teachers: many(teachers),
	accounts: many(account),
	admins: many(admins),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const coursesRelations = relations(courses, ({one, many}) => ({
	teacher: one(teachers, {
		fields: [courses.teacherId],
		references: [teachers.id]
	}),
	exams: many(exams),
	grades: many(grades),
	attendances: many(attendances),
	assignments: many(assignments),
	enrollments: many(enrollments),
}));

export const teachersRelations = relations(teachers, ({one, many}) => ({
	courses: many(courses),
	user: one(user, {
		fields: [teachers.userId],
		references: [user.id]
	}),
}));

export const studentsRelations = relations(students, ({one, many}) => ({
	user: one(user, {
		fields: [students.userId],
		references: [user.id]
	}),
	submissions: many(submissions),
	grades: many(grades),
	attendances: many(attendances),
	enrollments: many(enrollments),
}));

export const submissionsRelations = relations(submissions, ({one}) => ({
	assignment: one(assignments, {
		fields: [submissions.assignmentId],
		references: [assignments.id]
	}),
	student: one(students, {
		fields: [submissions.studentId],
		references: [students.id]
	}),
}));

export const assignmentsRelations = relations(assignments, ({one, many}) => ({
	submissions: many(submissions),
	grades: many(grades),
	course: one(courses, {
		fields: [assignments.courseId],
		references: [courses.id]
	}),
}));

export const examsRelations = relations(exams, ({one, many}) => ({
	course: one(courses, {
		fields: [exams.courseId],
		references: [courses.id]
	}),
	grades: many(grades),
}));

export const gradesRelations = relations(grades, ({one}) => ({
	student: one(students, {
		fields: [grades.studentId],
		references: [students.id]
	}),
	course: one(courses, {
		fields: [grades.courseId],
		references: [courses.id]
	}),
	assignment: one(assignments, {
		fields: [grades.assignmentId],
		references: [assignments.id]
	}),
	exam: one(exams, {
		fields: [grades.examId],
		references: [exams.id]
	}),
}));

export const attendancesRelations = relations(attendances, ({one}) => ({
	student: one(students, {
		fields: [attendances.studentId],
		references: [students.id]
	}),
	course: one(courses, {
		fields: [attendances.courseId],
		references: [courses.id]
	}),
}));

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	student: one(students, {
		fields: [enrollments.studentId],
		references: [students.id]
	}),
	course: one(courses, {
		fields: [enrollments.courseId],
		references: [courses.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const adminsRelations = relations(admins, ({one}) => ({
	user: one(user, {
		fields: [admins.userId],
		references: [user.id]
	}),
}));
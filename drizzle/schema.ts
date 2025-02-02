import { pgTable, foreignKey, text, timestamp, unique, integer, boolean, varchar, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("authenticator_credentialID_unique").on(table.credentialId),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
});

export const courses = pgTable("courses", {
	id: integer().primaryKey().notNull(),
	courseCode: varchar("course_code").notNull(),
	courseName: varchar("course_name").notNull(),
	description: text(),
	credits: integer().notNull(),
	teacherId: integer("teacher_id"),
}, (table) => [
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.id],
			name: "courses_teacher_id_teachers_id_fk"
		}),
	unique("courses_course_code_unique").on(table.courseCode),
]);

export const students = pgTable("students", {
	id: integer().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	studentId: varchar("student_id").notNull(),
	program: varchar().notNull(),
	batch: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "students_user_id_user_id_fk"
		}),
	unique("students_student_id_unique").on(table.studentId),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const submissions = pgTable("submissions", {
	id: integer().primaryKey().notNull(),
	assignmentId: integer("assignment_id"),
	studentId: integer("student_id"),
	submissionUrl: varchar("submission_url").notNull(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow(),
	status: varchar().notNull(),
	feedback: text(),
	isLate: boolean("is_late").default(false),
}, (table) => [
	foreignKey({
			columns: [table.assignmentId],
			foreignColumns: [assignments.id],
			name: "submissions_assignment_id_assignments_id_fk"
		}),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "submissions_student_id_students_id_fk"
		}),
]);

export const teachers = pgTable("teachers", {
	id: integer().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	department: varchar().notNull(),
	designation: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "teachers_user_id_user_id_fk"
		}),
]);

export const exams = pgTable("exams", {
	id: integer().primaryKey().notNull(),
	courseId: integer("course_id"),
	examType: varchar("exam_type").notNull(),
	examDate: timestamp("exam_date", { mode: 'string' }).notNull(),
	duration: integer().notNull(),
	totalMarks: integer("total_marks").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "exams_course_id_courses_id_fk"
		}),
]);

export const grades = pgTable("grades", {
	id: integer().primaryKey().notNull(),
	studentId: integer("student_id"),
	courseId: integer("course_id"),
	assignmentId: integer("assignment_id"),
	examId: integer("exam_id"),
	marks: integer().notNull(),
	grade: varchar().notNull(),
	gradedAt: timestamp("graded_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "grades_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "grades_course_id_courses_id_fk"
		}),
	foreignKey({
			columns: [table.assignmentId],
			foreignColumns: [assignments.id],
			name: "grades_assignment_id_assignments_id_fk"
		}),
	foreignKey({
			columns: [table.examId],
			foreignColumns: [exams.id],
			name: "grades_exam_id_exams_id_fk"
		}),
]);

export const attendances = pgTable("attendances", {
	id: integer().primaryKey().notNull(),
	studentId: integer("student_id"),
	courseId: integer("course_id"),
	attendanceDate: timestamp("attendance_date", { mode: 'string' }).notNull(),
	status: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "attendances_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "attendances_course_id_courses_id_fk"
		}),
]);

export const assignments = pgTable("assignments", {
	id: integer().primaryKey().notNull(),
	courseId: integer("course_id"),
	title: varchar().notNull(),
	description: text(),
	dueDate: timestamp("due_date", { mode: 'string' }).notNull(),
	totalMarks: integer("total_marks").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "assignments_course_id_courses_id_fk"
		}),
]);

export const enrollments = pgTable("enrollments", {
	id: integer().primaryKey().notNull(),
	studentId: integer("student_id"),
	courseId: integer("course_id"),
	semester: varchar().notNull(),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "enrollments_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "enrollments_course_id_courses_id_fk"
		}),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const admins = pgTable("admins", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	department: varchar().notNull(),
	accessLevel: varchar("access_level").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "admins_user_id_user_id_fk"
		}),
]);

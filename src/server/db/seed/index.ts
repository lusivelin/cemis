import { db } from '@/server/db';
import {
  students,
  teachers,
  admins,
  courses,
  assignments,
  attendances,
  enrollments,
  exams,
  grades,
} from '@/server/db/schema';
import { seedStudents } from '@/server/db/seed/students';
import { seedTeachers } from '@/server/db/seed/teachers';
import { seedAdmins } from '@/server/db/seed/admins';
import { seedCourses } from '@/server/db/seed/courses';
import { seedAssignments } from '@/server/db/seed/assignments';
import { seedAttendances } from '@/server/db/seed/attendances';
import { seedEnrollments } from '@/server/db/seed/enrollments';
import { seedExams } from '@/server/db/seed/exams';
import { seedGrades } from '@/server/db/seed/grades';

async function seedDatabase() {
  try {
    await clearData();
    const studentIds = await seedStudents();
    const teacherIds = await seedTeachers();
    const adminIds = await seedAdmins();
    const courseIds = await seedCourses({ teacherIds: teacherIds.map((t) => t.id) });
    const assignmentIds = await seedAssignments({ courseIds: courseIds.map((t) => t.id) });
    const attendanceIds = await seedAttendances({
      courseIds: courseIds.map((t) => t.id),
      studentIds: studentIds.map((s) => s.id),
    });

    const enrollmentIds = await seedEnrollments({
      courseIds: courseIds.map((t) => t.id),
      studentIds: studentIds.map((s) => s.id),
    });

    const examIds = await seedExams({
      courseIds: courseIds.map((t) => t.id),
    });

    const gradeIds = await seedGrades({
      studentIds: studentIds.map((s) => s.id),
      courseIds: courseIds.map((t) => t.id),
      assignmentIds: assignmentIds,
      examIds: examIds,
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

async function clearData() {
  console.log('🧹 Clearing existing data...');
  await db.delete(students);
  await db.delete(teachers);
  await db.delete(admins);
  await db.delete(courses);
  await db.delete(assignments);
  await db.delete(attendances);
  await db.delete(enrollments);
  await db.delete(exams);
  await db.delete(grades);
}

seedDatabase();

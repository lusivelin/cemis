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
  users,
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
import { clearAuthData, seedUsers } from './users';

async function seedDatabase() {
  try {
    await clearData();
    const { adminUsers, teacherUsers, studentUsers } = await seedUsers({
      adminCount: 5,
      teacherCount: 10,
      studentCount: 20,
    });

    const studentIds = await seedStudents({
      count: 50,
      existingUsers: studentUsers,
    });
    const teacherIds = await seedTeachers({
      count: 30,
      existingUsers: teacherUsers,
    });
    const adminIds = await seedAdmins({
      count: 5,
      existingUsers: adminUsers,
    });
    const courseIds = await seedCourses({ teacherIds: teacherIds.map((t) => t.id) });
    const assignmentIds = await seedAssignments({ courseIds: courseIds.map((t) => t.id) });
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

    const attendanceIds = await seedAttendances({
      courseIds: courseIds.map((t) => t.id),
      studentIds: studentIds.map((s) => s.id),
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

async function clearData() {
  console.log('🧹 Clearing existing data...');
  await db.delete(grades);

  await db.delete(exams);
  await db.delete(assignments);
  await db.delete(attendances);
  await db.delete(enrollments);

  await db.delete(courses);

  await db.delete(students);
  await db.delete(teachers);
  await db.delete(admins);
  await db.delete(users);
  await clearAuthData();
}

seedDatabase();

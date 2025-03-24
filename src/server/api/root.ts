import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { studentRouter } from './routers/student-router';
import { courseRouter } from './routers/course-router';
import { teacherRouter } from './routers/teacher-router';

export const appRouter = createTRPCRouter({ students: studentRouter, courses: courseRouter, teachers: teacherRouter });

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);

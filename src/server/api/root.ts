import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { studentRouter } from './routers/student-router';
import { courseRouter } from './routers/course-router';

export const appRouter = createTRPCRouter({ students: studentRouter, courses: courseRouter });

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);

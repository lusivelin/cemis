import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { studentRouter } from './routers/student-router';

export const appRouter = createTRPCRouter({ students: studentRouter });

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);

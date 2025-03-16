import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { adminRouter } from './routers/admin-router';
import { studentRouter } from './routers/student-router';

export const appRouter = createTRPCRouter({ admin: adminRouter, student: studentRouter });

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);

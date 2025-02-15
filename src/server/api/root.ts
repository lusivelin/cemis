import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { eventsRouter } from './routers/events';
import { hotelsRouter } from './routers/hotels';
import { roomsRouter } from './routers/rooms';

export const appRouter = createTRPCRouter({ events: eventsRouter, hotels: hotelsRouter, rooms: roomsRouter });

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);

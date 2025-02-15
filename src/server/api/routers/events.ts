// import { events, eventTypeEnum, statusEnum } from '@/server/db/schema';
// import type { RouterInputs, RouterOutputs } from '@/trpc/shared';
// import { TRPCError } from '@trpc/server';
// import { eq, sql } from 'drizzle-orm';
// import { z } from 'zod';
// import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

// // inputs schema
// export const eventsInput = {
//   detail: z.object({ id: z.string() }),
//   create: z.object({
//     name: z.string().min(6),
//     type: z.enum(eventTypeEnum.enumValues),
//     startDate: z.coerce.date(),
//     endDate: z.coerce.date(),
//     numberOfDays: z.number().positive().min(1),
//     venue: z.string().nonempty(),
//     city: z.string().nonempty(),
//     country: z.string().nonempty(),
//     bussing: z.string().nullable().optional(),
//     transport: z.string().nonempty(),
//     numberOfParticipants: z.number().positive().min(1),
//     coverImages: z.array(z.string()).min(1),
//     bookingOrderFooter: z.string().nullable().optional(),
//     prefixCode: z.string().nullable().optional(),
//     status: z.enum(statusEnum.enumValues),
//     emails: z.array(z.string()).min(1),
//   }),

//   delete: z.object({ id: z.string() }),

//   update: z.object({
//     id: z.string(),
//     body: z.object({
//       name: z.string().min(6),
//       type: z.enum(eventTypeEnum.enumValues),
//       startDate: z.coerce.date(),
//       endDate: z.coerce.date(),
//       numberOfDays: z.number().positive().min(1),
//       venue: z.string().nonempty(),
//       city: z.string().nonempty(),
//       country: z.string().nonempty(),
//       bussing: z.string().nullable().optional(),
//       transport: z.string().nonempty(),
//       numberOfParticipants: z.number().positive().min(1),
//       coverImages: z.array(z.string()).min(1),
//       bookingOrderFooter: z.string().nullable().optional(),
//       prefixCode: z.string().nullable().optional(),
//       status: z.enum(statusEnum.enumValues),
//       emails: z.array(z.string()).min(1),
//     }),
//   }),
// };

// export const eventsRouter = createTRPCRouter({
//   list: publicProcedure
//     .input(
//       z.object({
//         page: z.number().min(1).default(1),
//         limit: z.number().min(1).max(100).default(10),
//       })
//     )
//     .query(async ({ ctx, input }) => {
//       const { page, limit } = input;
//       const offset = (page - 1) * limit;

//       const [totalCount, data] = await Promise.all([
//         ctx.db
//           .select({ count: sql<number>`COUNT(*)` })
//           .from(events)
//           .limit(1)
//           .then((res) => Number(res[0]?.count || 0)),

//         ctx.db.select().from(events).limit(limit).offset(offset),
//       ]);

//       return {
//         data,
//         meta: {
//           total: totalCount,
//           page,
//           limit,
//           totalPages: Math.ceil(totalCount / limit),
//         },
//       };
//     }),

//   detail: publicProcedure.input(eventsInput.detail).query(async ({ ctx, input }) => {
//     const [data] = await ctx.db.select().from(events).where(eq(events.id, input.id));
//     if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found.' });
//     return data;
//   }),

//   create: protectedProcedure.input(eventsInput.create).mutation(async ({ ctx, input }) => {
//     const data = await ctx.db.select().from(events).where(eq(events.name, input.name));
//     if (data) throw new TRPCError({ code: 'CONFLICT', message: `Event with a name ${input.name} is already exist.` });
//     const createdData = await ctx.db.insert(events).values(input);
//     return { message: 'Event successfully created.', data: createdData };
//   }),

//   delete: protectedProcedure.input(eventsInput.delete).mutation(async ({ ctx, input }) => {
//     const [data] = await ctx.db.select().from(events).where(eq(events.id, input.id));
//     if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found.' });
//     await ctx.db.delete(events).where(eq(events.id, input.id));
//     return { message: 'Event successfully deleted.' };
//   }),

//   update: protectedProcedure.input(eventsInput.update).mutation(async ({ ctx, input }) => {
//     const [data] = await ctx.db.select().from(events).where(eq(events.id, input.id));
//     if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found.' });
//     await ctx.db.update(events).set(input.body).where(eq(events, input.id));
//     return { message: 'Event successfully updated.' };
//   }),
// });

// // export type of inputs and outputs, it helps frontend to use for components props, fetching and mutation.
// // outputs
// export type EventsListOutput = RouterOutputs['events']['list'];
// export type EventsDetailOutput = RouterOutputs['events']['detail'];
// export type EventsCreateOutput = RouterOutputs['events']['create'];
// export type EventsDeleteOutput = RouterOutputs['events']['delete'];
// export type EventsUpdateOutput = RouterOutputs['events']['update'];

// // inputs
// export type EventsListInput = RouterInputs['events']['list'];
// export type EventsDetailInput = RouterInputs['events']['detail'];
// export type EventsCreateInput = RouterInputs['events']['create'];
// export type EventsDeleteInput = RouterInputs['events']['delete'];
// export type EventsUpdateInput = RouterInputs['events']['update'];

// // NAMING CONVENTIONS
// // list: get all data.
// // create: create a data.
// // detail: get specific data by id.
// // update: update a data by id.
// // delete: delete a data by id

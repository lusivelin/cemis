// import { hotels } from '@/server/db/schema';
// import type { RouterInputs, RouterOutputs } from '@/trpc/shared';
// import { TRPCError } from '@trpc/server';
// import { desc, eq, sql } from 'drizzle-orm';
// import { z } from 'zod';
// import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
// import { paginate } from '@/server/api/provider/paginate';

// // Hotels input schema
// const ageRangeSchema = z
//   .tuple([z.number().min(0).max(100), z.number().min(0).max(100)])
//   .refine(([min, max]) => min <= max, {
//     message: 'Minimum age must be less than or equal to maximum age',
//   });

// export const hotelsInput = {
//   detail: z.object({
//     id: z.string(),
//   }),

//   create: z.object({
//     name: z.string().min(3),
//     address: z.string().nonempty(),
//     city: z.string().nonempty(),
//     country: z.string().nonempty(),
//     active: z.boolean().default(true),

//     // Age ranges
//     adultAgeRange: ageRangeSchema,
//     childWithoutBedAgeRange: ageRangeSchema,
//     childWithBedAgeRange: ageRangeSchema,
//     infantAgeRange: ageRangeSchema,

//     // Configuration
//     currencyCode: z.string().length(3),
//     assigned: z.boolean().default(false),

//     // Maximum occupancy limits
//     maxAdultExtraBed: z.number().int().min(0),
//     maxAdult: z.number().int().min(1),
//     maxInfant: z.number().int().min(0),
//     maxChildWithoutBed: z.number().int().min(0),
//     maxChildWithBed: z.number().int().min(0),
//   }),

//   delete: z.object({
//     id: z.string(),
//   }),

//   update: z.object({
//     id: z.string(),
//     body: z.object({
//       name: z.string().min(3),
//       address: z.string().nonempty(),
//       city: z.string().nonempty(),
//       country: z.string().nonempty(),
//       active: z.boolean().default(true),

//       adultAgeRange: ageRangeSchema.optional(),
//       childWithoutBedAgeRange: ageRangeSchema.optional(),
//       childWithBedAgeRange: ageRangeSchema.optional(),
//       infantAgeRange: ageRangeSchema.optional(),

//       currencyCode: z.string().length(3).optional(),
//       assigned: z.boolean().default(false),

//       maxAdultExtraBed: z.number().int().min(0).optional(),
//       maxAdult: z.number().int().min(1).optional(),
//       maxInfant: z.number().int().min(0).optional(),
//       maxChildWithoutBed: z.number().int().min(0).optional(),
//       maxChildWithBed: z.number().int().min(0).optional(),
//     }),
//   }),
// };

// // Hotels Router
// export const hotelsRouter = createTRPCRouter({
//   list: publicProcedure
//     .input(
//       z.object({
//         page: z.number().min(1).default(1),
//         limit: z.number().min(1).max(100).default(10),
//         search: z.string().optional(),
//       })
//     )
//     .query(async ({ ctx, input }) => {
//       const { page, limit, search } = input;
//       const offset = (page - 1) * limit;

//       const whereClause = search
//         ? sql`(
//           LOWER(${hotels.name}) ILIKE ${`%${search.toLowerCase()}%`}
//         )`
//         : sql`true`;

//       const dataQuery = ctx.db
//         .select({
//           id: hotels.id,
//           name: hotels.name,
//           address: hotels.address,
//           city: hotels.city,
//           country: hotels.country,
//           active: hotels.active,
//         })
//         .from(hotels)
//         .where(whereClause)
//         .orderBy(desc(hotels.createdAt))
//         .limit(limit)
//         .offset(offset);

//       const countQuery = ctx.db
//         .select({ count: sql<number>`COUNT(*)` })
//         .from(hotels)
//         .where(whereClause)
//         .limit(1)
//         .then((res) => ({ count: Number(res[0]?.count ?? 0) }));

//       return paginate(dataQuery, countQuery, page, limit);
//     }),

//   detail: publicProcedure.input(hotelsInput.detail).query(async ({ ctx, input }) => {
//     const [data] = await ctx.db.select().from(hotels).where(eq(hotels.id, input.id));
//     if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Hotel not found.' });
//     return data;
//   }),

//   create: protectedProcedure.input(hotelsInput.create).mutation(async ({ ctx, input }) => {
//     const data = await ctx.db.select().from(hotels).where(eq(hotels.name, input.name));
//     if (data.length)
//       throw new TRPCError({ code: 'CONFLICT', message: `Hotel with name ${input.name} already exists.` });
//     const createdData = await ctx.db.insert(hotels).values(input);
//     return { message: 'Hotel successfully created.', data: createdData };
//   }),

//   delete: protectedProcedure.input(hotelsInput.delete).mutation(async ({ ctx, input }) => {
//     const [data] = await ctx.db.select().from(hotels).where(eq(hotels.id, input.id));
//     if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Hotel not found.' });
//     await ctx.db.delete(hotels).where(eq(hotels.id, input.id));
//     return { message: 'Hotel successfully deleted.' };
//   }),

//   update: protectedProcedure.input(hotelsInput.update).mutation(async ({ ctx, input }) => {
//     const [data] = await ctx.db.select().from(hotels).where(eq(hotels.id, input.id));
//     if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Hotel not found.' });
//     await ctx.db.update(hotels).set(input.body).where(eq(hotels.id, input.id));
//     return { message: 'Hotel successfully updated.' };
//   }),
// });

// // Export types for frontend use
// // Hotels types
// export type HotelsListOutput = RouterOutputs['hotels']['list'];
// export type HotelsDetailOutput = RouterOutputs['hotels']['detail'];
// export type HotelsCreateOutput = RouterOutputs['hotels']['create'];
// export type HotelsDeleteOutput = RouterOutputs['hotels']['delete'];
// export type HotelsUpdateOutput = RouterOutputs['hotels']['update'];

// export type HotelsListInput = RouterInputs['hotels']['list'];
// export type HotelsDetailInput = RouterInputs['hotels']['detail'];
// export type HotelsCreateInput = RouterInputs['hotels']['create'];
// export type HotelsDeleteInput = RouterInputs['hotels']['delete'];
// export type HotelsUpdateInput = RouterInputs['hotels']['update'];

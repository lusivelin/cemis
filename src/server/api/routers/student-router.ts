import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { like, desc, asc, and, sql, or, SQL } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { students } from '@/server/db/schema/students';

export const studentRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        sort: z.enum(['firstName', 'lastName', 'batch', 'program', 'createdAt']).optional().default('createdAt'),
        order: z.enum(['asc', 'desc']).optional().default('desc'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, sort, order } = input;
      const offset = (page - 1) * limit;

      try {
        const searchConditions = search ? or(
          like(students.firstName, `%${search}%`),
          like(students.lastName, `%${search}%`),
          like(students.displayName, `%${search}%`),
          like(students.email, `%${search}%`),
          like(students.program, `%${search}%`)
        ) : undefined

        const whereConditions = [searchConditions].filter(Boolean);

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        const orderDirection = order === 'asc' ? asc : desc;


        const orderByExpressions = new Map<typeof sort, SQL<unknown>>([
          ['firstName', orderDirection(students.firstName)],
          ['lastName', orderDirection(students.lastName)],
          ['batch', orderDirection(students.batch)],
          ['program', orderDirection(students.program)],
          ['createdAt', orderDirection(students.createdAt)],
        ])

        const sortOrder = orderByExpressions.get(sort) ?? orderDirection(students.createdAt);

        const studentsList = await ctx.db
          .select()
          .from(students)
          .where(whereClause)
          .orderBy(sortOrder)
          .limit(limit)
          .offset(offset);

        const countResult = await ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(students)
          .where(whereClause);

        const total = countResult[0]?.count ?? 0;
        const totalPages = Math.ceil(total / limit);

        return {
          data: studentsList,
          meta: {
            total,
            totalPages,
            page,
            limit,
          },
        };
      } catch (error) {
        console.error('Error in student list query:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch students',
          cause: error,
        });
      }
    }),
});

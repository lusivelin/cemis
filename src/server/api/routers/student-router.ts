import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { like, desc, asc, and, sql, or, SQL } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { students } from '@/server/db/schema/students';
import { studentCreateSchema } from '@/server/api/requests/student';
import { RouterOutputs } from '@/trpc/shared';

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
        const searchConditions = search
          ? or(
              like(students.firstName, `%${search}%`),
              like(students.lastName, `%${search}%`),
              like(students.displayName, `%${search}%`),
              like(students.email, `%${search}%`),
              like(students.program, `%${search}%`)
            )
          : undefined;

        const whereConditions = [searchConditions].filter(Boolean);

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        const orderDirection = order === 'asc' ? asc : desc;

        const orderByExpressions = new Map<typeof sort, SQL<unknown>>([
          ['firstName', orderDirection(students.firstName)],
          ['lastName', orderDirection(students.lastName)],
          ['batch', orderDirection(students.batch)],
          ['program', orderDirection(students.program)],
          ['createdAt', orderDirection(students.createdAt)],
        ]);

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
  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      const student = await ctx.db
        .select()
        .from(students)
        .where(sql`${students.id} = ${input.id}`)
        .limit(1);

      if (!student || student.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Student not found',
        });
      }

      return student[0];
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch student',
        cause: error,
      });
    }
  }),
  create: protectedProcedure.input(studentCreateSchema).mutation(async ({ ctx, input }) => {
    try {
      const displayName = input.displayName || `${input.firstName} ${input.lastName}`;

      const result = await ctx.db
        .insert(students)
        .values({
          ...input,
          displayName,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error creating student:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create student',
        cause: error,
      });
    }
  }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      body: studentCreateSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, body } = input;
        
        let updateData = { ...body };
        if (body.firstName || body.lastName) {
          const currentStudent = await ctx.db
            .select()
            .from(students)
            .where(sql`${students.id} = ${id}`)
            .limit(1);
            
          if (currentStudent.length > 0) {
            const firstName = body.firstName ?? currentStudent[0].firstName;
            const lastName = body.lastName ?? currentStudent[0].lastName;
            updateData.displayName = `${firstName} ${lastName}`;
          }
        }
        
        updateData.updatedAt = new Date();
        
        const result = await ctx.db
          .update(students)
          .set(updateData)
          .where(sql`${students.id} = ${id}`)
          .returning();
          
        if (!result || result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Student not found',
          });
        }
        
        return result[0];
      } catch (error) {
        console.error('Error updating student:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update student',
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .delete(students)
          .where(sql`${students.id} = ${input.id}`)
          .returning();
          
        if (!result || result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Student not found',
          });
        }
        
        return result[0];
      } catch (error) {
        console.error('Error deleting student:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete student',
          cause: error,
        });
      }
    }),
});

export type StudentListOutput = RouterOutputs['students']['list'];
export type StudentDetailOutput = RouterOutputs['students']['detail'];

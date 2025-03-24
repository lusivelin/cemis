import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { like, desc, asc, and, sql, or, SQL } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { teachers } from '@/server/db/schema/teachers';
import { RouterOutputs } from '@/trpc/shared';
import { teacherCreateSchema, teacherListSchema, teacherUpdateSchema } from '@/server/api/requests/teacher';

export const teacherRouter = createTRPCRouter({
  list: protectedProcedure.input(teacherListSchema).query(async ({ ctx, input }) => {
    const { page, limit, search, sort, order } = input;
    const offset = (page - 1) * limit;

    try {
      const searchConditions = search
        ? or(
            like(teachers.firstName, `%${search}%`),
            like(teachers.lastName, `%${search}%`),
            like(teachers.displayName, `%${search}%`),
            like(teachers.email, `%${search}%`),
            like(teachers.department, `%${search}%`),
            like(teachers.designation, `%${search}%`)
          )
        : undefined;

      const whereConditions = [searchConditions].filter(Boolean);
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
      const orderDirection = order === 'asc' ? asc : desc;

      const orderByExpressions = new Map<typeof sort, SQL<unknown>>([
        ['firstName', orderDirection(teachers.firstName)],
        ['lastName', orderDirection(teachers.lastName)],
        ['department', orderDirection(teachers.department)],
        ['designation', orderDirection(teachers.designation)],
        ['createdAt', orderDirection(teachers.createdAt)],
      ]);

      const sortOrder = orderByExpressions.get(sort) ?? orderDirection(teachers.createdAt);

      const teachersList = await ctx.db
        .select({
          id: teachers.id,
          userId: teachers.userId,
          firstName: teachers.firstName,
          lastName: teachers.lastName,
          displayName: teachers.displayName,
          email: teachers.email,
          phone: teachers.phone,
          gender: teachers.gender,
          dateOfBirth: teachers.dateOfBirth,
          department: teachers.department,
          designation: teachers.designation,
          createdAt: teachers.createdAt,
          updatedAt: teachers.updatedAt,
        })
        .from(teachers)
        .where(whereClause)
        .orderBy(sortOrder)
        .limit(limit)
        .offset(offset);

      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(teachers)
        .where(whereClause);

      const total = countResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: teachersList,
        meta: {
          total,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error('Error in teacher list query:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch teachers',
        cause: error,
      });
    }
  }),

  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      const teacher = await ctx.db
        .select({
          id: teachers.id,
          userId: teachers.userId,
          firstName: teachers.firstName,
          lastName: teachers.lastName,
          displayName: teachers.displayName,
          email: teachers.email,
          phone: teachers.phone,
          gender: teachers.gender,
          dateOfBirth: teachers.dateOfBirth,
          department: teachers.department,
          designation: teachers.designation,
          createdAt: teachers.createdAt,
          updatedAt: teachers.updatedAt,
        })
        .from(teachers)
        .where(sql`${teachers.id} = ${input.id}`)
        .limit(1);

      if (!teacher || teacher.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Teacher not found',
        });
      }

      return teacher[0];
    } catch (error) {
      console.error('Error fetching teacher by ID:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch teacher',
        cause: error,
      });
    }
  }),

  create: protectedProcedure.input(teacherCreateSchema).mutation(async ({ ctx, input }) => {
    try {
      const displayName = input.displayName || `${input.firstName} ${input.lastName}`;

      const existingTeacher = await ctx.db
        .select({ id: teachers.id })
        .from(teachers)
        .where(sql`${teachers.email} = ${input.email}`)
        .limit(1);

      if (existingTeacher && existingTeacher.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A teacher with this email already exists',
        });
      }

      const result = await ctx.db
        .insert(teachers)
        .values({
          ...input,
          displayName: displayName || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error creating teacher:', error);

      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.errors[0]?.message || 'Validation failed',
          cause: error,
        });
      }

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create teacher',
        cause: error,
      });
    }
  }),

  update: protectedProcedure.input(teacherUpdateSchema).mutation(async ({ ctx, input }) => {
    try {
      const { id, body } = input;

      const currentTeacher = await ctx.db
        .select()
        .from(teachers)
        .where(sql`${teachers.id} = ${id}`)
        .limit(1);

      if (!currentTeacher || currentTeacher.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Teacher not found',
        });
      }

      if (body.email && body.email !== currentTeacher[0].email) {
        const existingEmail = await ctx.db
          .select({ id: teachers.id })
          .from(teachers)
          .where(sql`${teachers.email} = ${body.email} AND ${teachers.id} <> ${id}`)
          .limit(1);

        if (existingEmail && existingEmail.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A teacher with this email already exists',
          });
        }
      }

      const updateValues: Record<string, unknown> = { ...body };

      if (body.firstName || body.lastName) {
        const firstName = body.firstName ?? currentTeacher[0].firstName;
        const lastName = body.lastName ?? currentTeacher[0].lastName;
        updateValues.displayName = body.displayName || `${firstName} ${lastName}`;
      }

      updateValues.updatedAt = new Date();

      const result = await ctx.db
        .update(teachers)
        .set(updateValues)
        .where(sql`${teachers.id} = ${id}`)
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error updating teacher:', error);

      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.errors[0]?.message || 'Validation failed',
          cause: error,
        });
      }

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update teacher',
        cause: error,
      });
    }
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    try {
      const checkTeacher = await ctx.db
        .select({ id: teachers.id })
        .from(teachers)
        .where(sql`${teachers.id} = ${input.id}`)
        .limit(1);

      if (!checkTeacher || checkTeacher.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Teacher not found',
        });
      }

      const result = await ctx.db
        .delete(teachers)
        .where(sql`${teachers.id} = ${input.id}`)
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error deleting teacher:', error);

      if (
        error instanceof Error &&
        (error.message.includes('foreign key constraint') ||
          (error.cause && typeof error.cause === 'object' && 'code' in error.cause && error.cause.code === '23503'))
      ) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Cannot delete this teacher because they are assigned to one or more courses. Please reassign those courses first.',
          cause: error,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete teacher',
        cause: error,
      });
    }
  }),
});

export type TeacherListOutput = RouterOutputs['teachers']['list'];
export type TeacherDetailOutput = RouterOutputs['teachers']['detail'];

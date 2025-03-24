import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { like, desc, asc, and, sql, or, SQL } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { courses } from '@/server/db/schema/courses';
import { teachers } from '@/server/db/schema/teachers';
import { RouterOutputs } from '@/trpc/shared';
import { courseCreateSchema, courseListSchema, courseUpdateSchema } from '@/server/api/requests/course';

export const courseRouter = createTRPCRouter({
  list: protectedProcedure.input(courseListSchema).query(async ({ ctx, input }) => {
    const { page, limit, search, sort, order } = input;
    const offset = (page - 1) * limit;

    try {
      const searchConditions = search
        ? or(
            like(courses.name, `%${search}%`),
            like(courses.code, `%${search}%`),
            like(courses.description, `%${search}%`)
          )
        : undefined;

      const whereConditions = [searchConditions].filter(Boolean);
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
      const orderDirection = order === 'asc' ? asc : desc;

      const orderByExpressions = new Map<typeof sort, SQL<unknown>>([
        ['name', orderDirection(courses.name)],
        ['code', orderDirection(courses.code)],
        ['credits', orderDirection(courses.credits)],
        ['createdAt', orderDirection(courses.createdAt)],
      ]);

      const sortOrder = orderByExpressions.get(sort) ?? orderDirection(courses.createdAt);

      // Fixed select syntax for drizzle
      const coursesList = await ctx.db
        .select({
          id: courses.id,
          teacherId: courses.teacherId,
          credits: courses.credits,
          code: courses.code,
          name: courses.name,
          description: courses.description,
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
          teacherFirstName: teachers.firstName,
          teacherLastName: teachers.lastName,
          teacherDisplayName: teachers.displayName,
        })
        .from(courses)
        .leftJoin(teachers, sql`${courses.teacherId} = ${teachers.id}`)
        .where(whereClause)
        .orderBy(sortOrder)
        .limit(limit)
        .offset(offset);

      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(courses)
        .where(whereClause);

      const total = countResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: coursesList,
        meta: {
          total,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error('Error in course list query:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch courses',
        cause: error,
      });
    }
  }),

  detail: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      // Fixed select syntax for drizzle
      const courseResult = await ctx.db
        .select({
          id: courses.id,
          teacherId: courses.teacherId,
          credits: courses.credits,
          code: courses.code,
          name: courses.name,
          description: courses.description,
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
          teacherFirstName: teachers.firstName,
          teacherLastName: teachers.lastName,
          teacherDisplayName: teachers.displayName,
          teacherEmail: teachers.email,
          teacherDepartment: teachers.department,
          teacherDesignation: teachers.designation,
        })
        .from(courses)
        .leftJoin(teachers, sql`${courses.teacherId} = ${teachers.id}`)
        .where(sql`${courses.id} = ${input.id}`)
        .limit(1);

      if (!courseResult || courseResult.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course not found',
        });
      }

      const course = courseResult[0];

      return {
        ...course,
        teacherName:
          course.teacherDisplayName ||
          (course.teacherFirstName && course.teacherLastName
            ? `${course.teacherFirstName} ${course.teacherLastName}`
            : null),
      };
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch course',
        cause: error,
      });
    }
  }),

  create: protectedProcedure.input(courseCreateSchema).mutation(async ({ ctx, input }) => {
    try {
      if (input.teacherId) {
        const teacherExists = await ctx.db
          .select({ id: teachers.id })
          .from(teachers)
          .where(sql`${teachers.id} = ${input.teacherId}`)
          .limit(1);

        if (!teacherExists || teacherExists.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Teacher not found',
          });
        }
      }

      const existingCourse = await ctx.db
        .select({ code: courses.code })
        .from(courses)
        .where(sql`${courses.code} = ${input.code}`)
        .limit(1);

      if (existingCourse && existingCourse.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A course with this code already exists',
        });
      }

      const result = await ctx.db
        .insert(courses)
        .values({
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error creating course:', error);

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
        message: 'Failed to create course',
        cause: error,
      });
    }
  }),

  update: protectedProcedure.input(courseUpdateSchema).mutation(async ({ ctx, input }) => {
    try {
      const { id, body } = input;

      if (body.teacherId) {
        const teacherExists = await ctx.db
          .select({ id: teachers.id })
          .from(teachers)
          .where(sql`${teachers.id} = ${body.teacherId}`)
          .limit(1);

        if (!teacherExists || teacherExists.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Teacher not found',
          });
        }
      }

      const courseExists = await ctx.db
        .select({ code: courses.code })
        .from(courses)
        .where(sql`${courses.id} = ${id}`)
        .limit(1);

      if (!courseExists || courseExists.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course not found',
        });
      }

      if (body.code && body.code !== courseExists[0].code) {
        const codeExists = await ctx.db
          .select({ id: courses.id })
          .from(courses)
          .where(sql`${courses.code} = ${body.code} AND ${courses.id} <> ${id}`)
          .limit(1);

        if (codeExists && codeExists.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A course with this code already exists',
          });
        }
      }

      const updateData = {
        ...body,
        updatedAt: new Date(),
      };

      const result = await ctx.db
        .update(courses)
        .set(updateData)
        .where(sql`${courses.id} = ${id}`)
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error updating course:', error);

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
        message: 'Failed to update course',
        cause: error,
      });
    }
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    try {
      const checkCourse = await ctx.db
        .select({ id: courses.id })
        .from(courses)
        .where(sql`${courses.id} = ${input.id}`)
        .limit(1);

      if (!checkCourse || checkCourse.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course not found',
        });
      }

      const result = await ctx.db
        .delete(courses)
        .where(sql`${courses.id} = ${input.id}`)
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error deleting course:', error);

      if (
        error instanceof Error &&
        (error.message.includes('foreign key constraint') ||
          (error.cause && typeof error.cause === 'object' && 'code' in error.cause && error.cause.code === '23503'))
      ) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Cannot delete this course because it has active enrollments. Please remove all course enrollments first.',
          cause: error,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete course',
        cause: error,
      });
    }
  }),
});

export type CourseListOutput = RouterOutputs['courses']['list'];
export type CourseDetailOutput = RouterOutputs['courses']['detail'];

export function formatTeacherName(course: {
  teacherFirstName?: string | null;
  teacherLastName?: string | null;
  teacherDisplayName?: string | null;
}) {
  if (course.teacherDisplayName) {
    return course.teacherDisplayName;
  } else if (course.teacherFirstName && course.teacherLastName) {
    return `${course.teacherFirstName} ${course.teacherLastName}`;
  } else {
    return 'No teacher assigned';
  }
}

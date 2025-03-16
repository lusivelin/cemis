// src/server/api/routers/student-router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq, like, desc, asc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { students } from "@/server/db/schema/students";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";

export const studentRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      search: z.string().optional(),
      sort: z.enum(['batch', 'program', 'createdAt']).optional().default('createdAt'),
      order: z.enum(['asc', 'desc']).optional().default('desc'),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, search, sort, order } = input;
      const offset = (page - 1) * limit;
      
      try {
        // Build where conditions for search
        let whereConditions = [];
        if (search) {
          whereConditions.push(like(students.program, `%${search}%`));
        }
        
        // Build the where clause
        const whereClause = whereConditions.length > 0 
          ? and(...whereConditions) 
          : undefined;
        
        // Get the ordered column
        const orderColumn = (() => {
          switch (sort) {
            case 'batch': return students.batch;
            case 'program': return students.program;
            default: return students.createdAt;
          }
        })();
        
        // Get the order direction
        const orderDirection = order === 'asc' ? asc : desc;
        
        // Get students with pagination
        const studentsList = await ctx.db.query.students.findMany({
          where: whereClause,
          limit,
          offset,
          orderBy: orderDirection(orderColumn),
        });
        
        // Extract auth user IDs to fetch profiles
        const authUserIds = studentsList.map(student => student.authUserId);
        
        // Fetch user profiles from Supabase
        const { data: userProfiles, error } = await ctx.supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', authUserIds);
          
        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch user profiles',
            cause: error
          });
        }
        
        // Create a map for quick lookup
        const profileMap = new Map();
        if (userProfiles) {
          userProfiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Combine student data with user profiles
        const enrichedStudents = studentsList.map(student => {
          const profile = profileMap.get(student.authUserId);
          return {
            ...student,
            user: profile ? {
              id: profile.id,
              name: profile.full_name || 'Unknown',
              email: profile.email || '',
              avatarUrl: profile.avatar_url || '',
            } : null
          };
        });
        
        // Count total students for pagination
        const countResult = await ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(students)
          .where(whereClause || undefined);
        
        const total = countResult[0]?.count ?? 0;
        const totalPages = Math.ceil(total / limit);
        
        return {
          data: enrichedStudents,
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
          cause: error
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const student = await ctx.db.query.students.findFirst({
          where: eq(students.id, input.id),
          with: {
            enrollments: {
              with: {
                course: true,
              },
            },
          },
        });
        
        if (!student) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Student not found'
          });
        }
        
        // Get user profile from Supabase
        const { data: profile, error } = await ctx.supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', student.authUserId)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        }
        
        return {
          ...student,
          user: profile ? {
            id: profile.id,
            name: profile.full_name || '',
            email: profile.email || '',
            avatarUrl: profile.avatar_url || '',
          } : null
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error in getById:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch student',
          cause: error
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const studentsList = await ctx.db.query.students.findMany();
      
      // Extract auth user IDs to fetch profiles
      const authUserIds = studentsList.map(student => student.authUserId);
      
      // Fetch user profiles from Supabase
      const { data: profiles, error } = await ctx.supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', authUserIds);
        
      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user profiles',
          cause: error
        });
      }
      
      // Create a map for quick lookup
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }
      
      // Combine student data with user profiles
      return studentsList.map(student => {
        const profile = profileMap.get(student.authUserId);
        return {
          ...student,
          user: profile ? {
            id: profile.id,
            name: profile.full_name || 'Unknown',
            email: profile.email || '',
            avatarUrl: profile.avatar_url || '',
          } : null
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch students',
        cause: error
      });
    }
  }),

  getByAuthUserId: protectedProcedure
    .input(z.object({ authUserId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const student = await ctx.db.query.students.findFirst({
          where: eq(students.authUserId, input.authUserId),
        });
        
        if (!student) return null;
        
        // Get user profile from Supabase
        const { data: profile, error } = await ctx.supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', student.authUserId)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        }
        
        return {
          ...student,
          user: profile ? {
            id: profile.id,
            name: profile.full_name || '',
            email: profile.email || '',
            avatarUrl: profile.avatar_url || '',
          } : null
        };
      } catch (error) {
        console.error('Error in getByAuthUserId:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch student by auth ID',
          cause: error
        });
      }
    }),

  create: protectedProcedure
    .input(z.object({
      authUserId: z.string(),
      batch: z.number().int().positive(),
      program: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the auth user exists in Supabase
        const { data: userExists, error: userCheckError } = await ctx.supabase
          .from('profiles')
          .select('id')
          .eq('id', input.authUserId)
          .single();
          
        if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 is "not found" which we handle below
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to check user existence',
            cause: userCheckError
          });
        }
        
        if (!userExists) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User does not exist in Supabase'
          });
        }
        
        // Check if student with this auth ID already exists
        const existingStudent = await ctx.db.query.students.findFirst({
          where: eq(students.authUserId, input.authUserId),
        });
        
        if (existingStudent) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A student with this user ID already exists'
          });
        }
        
        // Create the student
        const result = await ctx.db.insert(students).values({
          authUserId: input.authUserId,
          batch: input.batch,
          program: input.program,
        }).returning();
        
        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error in create:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create student',
          cause: error
        });
      }
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      batch: z.number().int().positive().optional(),
      program: z.string().min(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        
        // Verify that the student exists
        const existingStudent = await ctx.db.query.students.findFirst({
          where: eq(students.id, id),
        });
        
        if (!existingStudent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Student not found'
          });
        }
        
        // Update the student
        const result = await ctx.db.update(students)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(students.id, id))
          .returning();
          
        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error in update:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update student',
          cause: error
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify that the student exists
        const existingStudent = await ctx.db.query.students.findFirst({
          where: eq(students.id, input.id),
        });
        
        if (!existingStudent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Student not found'
          });
        }
        
        // Delete the student
        const result = await ctx.db.delete(students)
          .where(eq(students.id, input.id))
          .returning();
          
        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error in delete:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete student',
          cause: error
        });
      }
    }),
});

export type StudentCreateOutput = RouterOutputs['student']['create'];
export type StudentDeleteOutput = RouterOutputs['student']['delete'];
export type StudentUpdateOutput = RouterOutputs['student']['update'];

// inputs
export type StudentCreateInput = RouterInputs['student']['create'];
export type StudentDeleteInput = RouterInputs['student']['delete'];
export type StudentUpdateInput = RouterInputs['student']['update'];

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { admins } from "@/server/db/schema/admins";

export const adminRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.admins.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.admins.findFirst({
        where: eq(admins.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(z.object({ authUserId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(admins).values({
        authUserId: input.authUserId,
      }).returning();
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      authUserId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.update(admins)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(admins.id, id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(admins)
        .where(eq(admins.id, input.id))
        .returning();
    }),
});

export type AdminCreateOutput = RouterOutputs['admin']['create'];
export type AdminDeleteOutput = RouterOutputs['admin']['delete'];
export type AdminUpdateOutput = RouterOutputs['admin']['update'];

// inputs
export type AdminCreateInput = RouterInputs['admin']['create'];
export type AdminDeleteInput = RouterInputs['admin']['delete'];
export type AdminUpdateInput = RouterInputs['admin']['update'];

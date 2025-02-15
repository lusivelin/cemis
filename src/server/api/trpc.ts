import { db } from '@/server/db';
import { createClient } from '@/server/supabase/server';
import { transformer } from '@/trpc/shared';
import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    return { ...opts, session, db, supabase };
  } catch (error) {
    // Handle connection errors gracefully
    console.error('Database connection error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database connection failed',
      cause: error,
    });
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const errorHandler = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('CONNECT_TIMEOUT')) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection timeout',
        cause: error,
      });
    }
    throw error;
  }
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(errorHandler);

export const protectedProcedure = t.procedure.use(errorHandler).use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

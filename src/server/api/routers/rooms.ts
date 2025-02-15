import { hotels, rooms } from '@/server/db/schema';
import type { RouterInputs, RouterOutputs } from '@/trpc/shared';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

// Occupant Limits Schema
const occupantLimitsSchema = z.object({
  adult: z.object({
    min: z.number().int().min(1),
    max: z.number().int().positive(),
  }),
  childWithBed: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  childWithoutBed: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  infant: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  extraBed: z.object({
    max: z.number().int().min(0),
  }),
  paxPerRoom: z.number().int().min(1),
});

// Pricing Schema
const pricingItemSchema = z.object({
  buyingPrice: z.number().positive(),
  costPrice: z.number().positive(),
  normalOnlinePrice: z.number().positive(),
  preLaunchRate: z.number().positive(),
  normalStartDate: z.date(),
  normalEndDate: z.date(),
  preLaunchStartDate: z.date(),
  preLaunchEndDate: z.date(),
  roomTypeDescription: z.string().optional(),
});

const pricingSchema = z.object({
  adult: pricingItemSchema,
  childWithBed: pricingItemSchema,
  childWithoutBed: pricingItemSchema,
  infant: pricingItemSchema,
});

// Rooms input schema
export const roomsInput = {
  detail: z.object({
    id: z.string(),
  }),

  create: z.object({
    hotelId: z.string(),
    name: z.string().min(2),
    description: z.string().optional(),
    photo: z.string().url().optional(),
    sleeps: z.number().int().positive(),
    sleepDescription: z.string().optional(),
    inventory: z.number().int().positive(),

    // Configuration
    bedConfiguration: z.string().optional(),
    displayOrder: z.number().int().positive(),
    addOn: z.string().optional(),
    extraBedAllowed: z.boolean().default(false),
    isTwinNoRoommate: z.boolean().default(false),
    openForOnlineRegistration: z.boolean().default(true),
    specialArrangement: z.boolean().default(false),

    // Occupancy limits
    occupantLimits: occupantLimitsSchema,

    // RTB configuration
    minCoupleRTB: z.number().int().min(1).max(3),
    minFamilyRTB: z.number().int().min(1).max(5),

    // Pricing
    pricing: pricingSchema,
  }),

  delete: z.object({
    id: z.string(),
  }),

  update: z.object({
    id: z.string(),
    body: z.object({
      hotelId: z.string().optional(),
      name: z.string().min(2).optional(),
      description: z.string().optional(),
      photo: z.string().url().optional(),
      sleeps: z.number().int().positive().optional(),
      sleepDescription: z.string().optional(),
      inventory: z.number().int().positive().optional(),

      bedConfiguration: z.string().optional(),
      displayOrder: z.number().int().positive().optional(),
      addOn: z.string().optional(),
      extraBedAllowed: z.boolean().optional(),
      isTwinNoRoommate: z.boolean().optional(),
      openForOnlineRegistration: z.boolean().optional(),
      specialArrangement: z.boolean().optional(),

      occupantLimits: occupantLimitsSchema.optional(),

      minCoupleRTB: z.number().int().min(1).max(3).optional(),
      minFamilyRTB: z.number().int().min(1).max(5).optional(),

      pricing: pricingSchema.optional(),
    }),
  }),
};

// Rooms Router
export const roomsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        hotelId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { hotelId } = input;

      const query = hotelId ? eq(rooms.hotelId, hotelId) : undefined;

      const data = await ctx.db.select().from(rooms).where(query);

      return {
        data,
      };
    }),

  detail: publicProcedure.input(roomsInput.detail).query(async ({ ctx, input }) => {
    const [data] = await ctx.db.select().from(rooms).where(eq(rooms.id, input.id));
    if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found.' });
    return data;
  }),

  create: protectedProcedure.input(roomsInput.create).mutation(async ({ ctx, input }) => {
    // Check if hotel exists
    const [hotel] = await ctx.db.select().from(hotels).where(eq(hotels.id, input.hotelId));
    if (!hotel) throw new TRPCError({ code: 'NOT_FOUND', message: 'Hotel not found.' });

    const createdData = await ctx.db.insert(rooms).values(input);
    return { message: 'Room successfully created.', data: createdData };
  }),

  delete: protectedProcedure.input(roomsInput.delete).mutation(async ({ ctx, input }) => {
    const [data] = await ctx.db.select().from(rooms).where(eq(rooms.id, input.id));
    if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found.' });
    await ctx.db.delete(rooms).where(eq(rooms.id, input.id));
    return { message: 'Room successfully deleted.' };
  }),

  update: protectedProcedure.input(roomsInput.update).mutation(async ({ ctx, input }) => {
    const [data] = await ctx.db.select().from(rooms).where(eq(rooms.id, input.id));
    if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found.' });

    if (input.body.hotelId && input.body.hotelId !== data.hotelId) {
      const [hotel] = await ctx.db.select().from(hotels).where(eq(hotels.id, input.body.hotelId));
      if (!hotel) throw new TRPCError({ code: 'NOT_FOUND', message: 'Hotel not found.' });
    }

    await ctx.db.update(rooms).set(input.body).where(eq(rooms.id, input.id));
    return { message: 'Room successfully updated.' };
  }),
});

// JSONB can't infer the type of the data, so we need to define it manually
export type RoomsOccupantLimits = {
  adult: { min: number; max: number };
  childWithBed: { min: number; max: number };
  childWithoutBed: { min: number; max: number };
  infant: { min: number; max: number };
  extraBed: { max: number };
  paxPerRoom: number;
};

export type Pricing = {
  buyingPrice: number;
  costPrice: number;
  normalOnlinePrice: number;
  preLaunchRate: number;
  normalStartDate: Date;
  normalEndDate: Date;
  preLaunchStartDate: Date;
  preLaunchEndDate: Date;
  roomTypeDescription?: string;
};

export type RoomsPricing = {
  adult: Pricing;
  childWithBed: Pricing;
  childWithoutBed: Pricing;
  infant: Pricing;
};

// Existing type exports remain the same
export type RoomsListOutput = RouterOutputs['rooms']['list'];
export type RoomsDetailOutput = RouterOutputs['rooms']['detail'] & {
  occupantLimits: RoomsOccupantLimits;
  pricing: RoomsPricing;
};

export type RoomsCreateOutput = RouterOutputs['rooms']['create'];

export type RoomsDeleteOutput = RouterOutputs['rooms']['delete'];
export type RoomsUpdateOutput = RouterOutputs['rooms']['update'];

export type RoomsListInput = RouterInputs['rooms']['list'];
export type RoomsDetailInput = RouterInputs['rooms']['detail'];
export type RoomsCreateInput = RouterInputs['rooms']['create'];
export type RoomsDeleteInput = RouterInputs['rooms']['delete'];
export type RoomsUpdateInput = RouterInputs['rooms']['update'];

import { z } from 'zod';

const studentBaseSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be less than 100 characters')
    .nullish(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().nullish(),
  gender: z.string().nullish(),
  dateOfBirth: z.date().nullish(),
  placeOfBirth: z.string().nullish(),
  nationality: z.string().nullish(),
  currentAddress: z.string().nullish(),
  permanentAddress: z.string().nullish(),
  guardianName: z.string().nullish(),
  guardianRelationship: z.string().nullish(),
  guardianPhone: z.string().nullish(),
  guardianEmail: z.string().email('Please enter a valid email address').nullish(),
  batch: z.number().int().min(1900, 'Batch year must be 1900 or later'),
  program: z.string().min(1, 'Program is required'),
  authUserId: z.string().uuid().nullish(),
});

const timestampFields = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
};

export const studentCreateSchema = studentBaseSchema.extend({
  ...timestampFields,
});

export const studentDetailSchema = studentBaseSchema.extend({
  id: z.string(),
  ...timestampFields,
});

export const studentUpdateSchema = z.object({
  id: z.string(),
  body: studentBaseSchema.partial(),
});

export const studentListSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['firstName', 'lastName', 'batch', 'program', 'createdAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type StudentCreate = z.infer<typeof studentCreateSchema>;
export type StudentDetail = z.infer<typeof studentDetailSchema>;
export type StudentUpdate = z.infer<typeof studentUpdateSchema>;
export type StudentListParams = z.infer<typeof studentListSchema>;

export type StudentListResponse = {
  data: StudentDetail[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
};

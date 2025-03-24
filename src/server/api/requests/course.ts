import { z } from 'zod';

const courseBaseSchema = z.object({
  teacherId: z.string().uuid('Invalid teacher ID').nullish(),
  code: z
    .string()
    .min(2, 'Course code must be at least 2 characters')
    .max(20, 'Course code must be less than 20 characters')
    .refine((code) => /^[A-Z0-9]+$/.test(code), {
      message: 'Course code must contain only uppercase letters and numbers',
    }),
  name: z
    .string()
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  credits: z
    .number()
    .int('Credits must be a whole number')
    .min(1, 'Credits must be at least 1')
    .max(12, 'Credits cannot exceed 12'),
});

const timestampFields = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
};

export const courseCreateSchema = courseBaseSchema.extend({
  ...timestampFields,
});

export const courseDetailSchema = courseBaseSchema.extend({
  id: z.string(),
  ...timestampFields,
});

export const courseUpdateSchema = z.object({
  id: z.string(),
  body: courseBaseSchema.partial(),
});

export const courseListSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['name', 'code', 'credits', 'createdAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CourseCreate = z.infer<typeof courseCreateSchema>;
export type CourseDetail = z.infer<typeof courseDetailSchema>;
export type CourseUpdate = z.infer<typeof courseUpdateSchema>;
export type CourseListParams = z.infer<typeof courseListSchema>;

export type CourseListResponse = {
  data: (CourseDetail & { teacherName?: string })[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
};

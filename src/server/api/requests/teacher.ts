import { z } from 'zod';

const teacherBaseSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
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
  department: z
    .string()
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must be less than 100 characters'),
  designation: z
    .string()
    .min(2, 'Designation must be at least 2 characters')
    .max(100, 'Designation must be less than 100 characters'),
});

const timestampFields = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
};

export const teacherCreateSchema = teacherBaseSchema.extend({
  ...timestampFields,
});

export const teacherDetailSchema = teacherBaseSchema.extend({
  id: z.string(),
  ...timestampFields,
});

export const teacherUpdateSchema = z.object({
  id: z.string(),
  body: teacherBaseSchema.partial(),
});

export const teacherListSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['firstName', 'lastName', 'department', 'designation', 'createdAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TeacherCreate = z.infer<typeof teacherCreateSchema>;
export type TeacherDetail = z.infer<typeof teacherDetailSchema>;
export type TeacherUpdate = z.infer<typeof teacherUpdateSchema>;
export type TeacherListParams = z.infer<typeof teacherListSchema>;

export type TeacherListResponse = {
  data: TeacherDetail[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
};

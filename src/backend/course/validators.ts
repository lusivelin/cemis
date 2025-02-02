import { z } from 'zod';

export const courseSchema = z.object({
  courseCode: z.string().min(2).max(10),
  courseName: z.string().min(3).max(100),
  description: z.string().optional(),
  credits: z.number().min(1).max(6),
  teacherId: z.number().positive(),
});

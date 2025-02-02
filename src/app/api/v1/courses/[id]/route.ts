import { courseSchema } from '@/backend/course/validators';
import { db } from '@/backend/db';
import { courses } from '@/backend/db/schema/course';
import { apiHandler } from '@/backend/middleware';
import { APIError } from '@/types/api';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiHandler(req, async () => {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, parseInt(params.id)),
      with: {
        teacher: true,
        assignments: true,
        enrollments: true,
      },
    });

    if (!course) {
      throw new APIError(404, 'Course not found');
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return apiHandler(req, async () => {
    const body = await req.json();
    const validatedData = courseSchema.partial().parse(body);

    const [updatedCourse] = await db
      .update(courses)
      .set({
        ...validatedData,
        // updatedAt: new Date()
      })
      .where(eq(courses.id, parseInt(params.id)))
      .returning();

    if (!updatedCourse) {
      throw new APIError(404, 'Course not found');
    }

    return NextResponse.json({
      success: true,
      data: updatedCourse,
    });
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return apiHandler(req, async () => {
    const [deletedCourse] = await db
      .delete(courses)
      .where(eq(courses.id, parseInt(params.id)))
      .returning();

    if (!deletedCourse) {
      throw new APIError(404, 'Course not found');
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  });
}

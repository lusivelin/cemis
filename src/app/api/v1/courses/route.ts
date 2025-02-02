import { db } from '@/backend/db';
import { eq, sql, desc } from 'drizzle-orm';
import { courses } from '@/backend/db/schema';
import { apiHandler } from '@/backend/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { courseSchema } from '@/backend/course/validators';

export async function GET(req: NextRequest) {
  return apiHandler(req, async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const query = search ? eq(courses.courseName, search) : undefined;

    const [courseList, total] = await Promise.all([
      db.select().from(courses).where(query).orderBy(desc(courses.createdAt)).limit(limit).offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(courses)
        .where(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        courses: courseList,
        pagination: {
          total: total[0].count,
          page,
          totalPages: Math.ceil(total[0].count / limit),
        },
      },
    });
  });
}

export async function POST(req: NextRequest) {
  return apiHandler(req, async () => {
    const body = await req.json();
    const validatedData = { id: sql`DEFAULT`, ...courseSchema.parse(body) };

    const [newCourse] = await db.insert(courses).values(validatedData).returning();

    return NextResponse.json(
      {
        success: true,
        data: newCourse,
      },
      { status: 201 }
    );
  });
}

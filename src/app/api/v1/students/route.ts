import { db } from '@/backend/db';
import { students } from '@/backend/db/schema/student';
import { apiHandler } from '@/backend/middleware';
import { eq, desc, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return apiHandler(req, async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const program = searchParams.get('program');

    const offset = (page - 1) * limit;

    const query = program ? eq(students.program, program) : undefined;

    const [studentList, total] = await Promise.all([
      db.select().from(students).where(query).orderBy(desc(students.createdAt)).limit(limit).offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .where(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        students: studentList,
        pagination: {
          total: total[0].count,
          page,
          totalPages: Math.ceil(total[0].count / limit),
        },
      },
    });
  });
}

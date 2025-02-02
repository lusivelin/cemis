import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { APIError } from '@/types/api';
import { auth } from '@/backend/auth';

export async function apiHandler(req: NextRequest, handler: (req: NextRequest) => Promise<Response>) {
  try {
    const session = await auth();

    if (!session) {
      throw new APIError(401, 'Unauthorized');
    }

    const response = await handler(req);
    return response;
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof APIError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

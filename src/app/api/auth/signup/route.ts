import { NextResponse } from 'next/server';
import { db } from '@/db/schema';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    // Implement user creation using drizzle schema
    const user = await db.createUser({ username, email, password });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { signIn } from '@/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

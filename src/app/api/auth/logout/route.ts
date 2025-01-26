import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

export async function POST() {
  try {
    await signOut({ redirect: false });
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

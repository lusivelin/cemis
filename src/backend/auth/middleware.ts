import NextAuth from 'next-auth';
import authConfig from '@/backend/auth/config';

export const { auth: middleware } = NextAuth(authConfig);

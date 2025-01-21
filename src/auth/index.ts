import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/schema';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/auth/validation/zod';
import { ZodError } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    // Credentials({
    //   credentials: {
    //     email: {},
    //     password: {},
    //   },
    //   authorize: async (credentials) => {
    //     try {
    //       let user = null

    //       const { email, password } = await signInSchema.parseAsync(credentials)

    //       // const pwHash = saltAndHashPassword(password)

    //       // user = await getUserFromDb(email, pwHash)

    //       // if (!user) {
    //       //   throw new Error("Invalid credentials.")
    //       // }

    //       // return user
    //       return { email, password }
    //     } catch (error) {
    //       if (error instanceof ZodError) {
    //         return null
    //       }
    //     }
    //   },
    // }),
  ],
});

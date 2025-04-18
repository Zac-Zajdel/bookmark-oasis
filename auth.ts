import { prisma } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { User as PrismaUser } from '@prisma/client';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.name) {
        token.name = session.name;

        await prisma.user.update({
          where: { id: token.id },
          data: { name: session.name },
        });
      }

      if (user) {
        token.id = user.id;
        token.createdAt = (user as PrismaUser).createdAt;
      }

      return token;
    },
    session({ token, session }: { token: JWT; session: Session }) {
      if (token) {
        session = {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            createdAt: token.createdAt,
          },
        };
      }

      return session;
    },
  },
});

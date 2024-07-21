import { db } from "@/lib/db"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { AdapterUser } from "next-auth/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ token, session }) {
      if (token) {
        session = {
          ...session,
          user: {
            ...session.user,
            id: token.id,
          } as AdapterUser,
        }
      }

      return session
    },
  },
})
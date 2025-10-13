import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { sanitizeCallbackUrl } from "@/lib/safeRedirect";
import type { ObjectId } from 'mongodb';

const secret = process.env.NEXTAUTH_SECRET;

type UserDb = { _id: ObjectId; email: string; passwordHash: string; username?: string; avatarUrl?: string; name?: string };

export const authOptions: NextAuthOptions = {
  secret,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const users = await getCollection<UserDb>("users");
        const user = await users.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username ?? user.name ?? user.email.split('@')[0],
          image: user.avatarUrl,
        };
      },
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        (token as { picture?: string }).picture = (user as { image?: string }).image;
      }
      return token;
    },
    async session({ session, token }) {
      const users = await getCollection<UserDb>("users");
      const id = token.sub;
      if (id) {
        const dbUser = await users.findOne({ _id: new (await import('mongodb')).ObjectId(id) });
        if (dbUser && session.user) {
          session.user.name = dbUser.username ?? dbUser.name ?? session.user.name ?? dbUser.email.split('@')[0];
          session.user.email = dbUser.email;
          session.user.image = (dbUser.avatarUrl ?? session.user.image ?? null) as string | null;
          (session.user as unknown as { id?: string }).id = id;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Sanitize to an internal path, then always return an absolute URL as required by NextAuth
      const safePath = sanitizeCallbackUrl(url, baseUrl);
      try {
        // Ensure baseUrl is absolute (expected format: https://host[:port])
        const isAbs = /^https?:\/\//i.test(baseUrl);
        if (!isAbs) return '/';
        return new URL(safePath || '/', baseUrl).toString();
      } catch {
        return baseUrl;
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export function auth() {
  return getServerSession(authOptions);
}

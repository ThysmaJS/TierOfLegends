import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { sanitizeCallbackUrl } from "@/lib/safeRedirect";

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

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
        const users = await getCollection<{ _id: string; email: string; passwordHash: string; name?: string }>("users");
        const user = await users.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return sanitizeCallbackUrl(url, baseUrl);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export function auth() {
  return getServerSession(authOptions);
}

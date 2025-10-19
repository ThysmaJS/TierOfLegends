import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import type { ObjectId } from 'mongodb';

export type UserDb = { _id: ObjectId; email: string; role?: 'USER' | 'ADMIN' };

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const users = await getCollection<UserDb>('users');
  const dbUser = await users.findOne({ email: session.user.email.toLowerCase() });
  if (!dbUser || (dbUser.role ?? 'USER') !== 'ADMIN') return null;
  return { session, dbUser } as const;
}

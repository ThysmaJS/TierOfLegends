import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/authz';
import type { ObjectId } from 'mongodb';

type UserDoc = { _id: ObjectId; email: string; username?: string; role?: 'USER' | 'ADMIN'; createdAt?: Date };

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await getCollection<UserDoc>('users');
  const list = await users.find({}, { projection: { email: 1, username: 1, role: 1, createdAt: 1 } }).toArray();
  return NextResponse.json({ users: list.map(u => ({ id: u._id.toString(), email: u.email, username: u.username, role: u.role ?? 'USER', createdAt: u.createdAt?.toISOString() })) });
}

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/authz';
import { ObjectId } from 'mongodb';
import type { TierListDoc } from '@/types/tierlist';

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await ctx.params;
  let userId: ObjectId;
  try { userId = new ObjectId(id); } catch { return NextResponse.json({ error: 'Invalid id' }, { status: 400 }); }

  const users = await getCollection('users');
  const res = await users.deleteOne({ _id: userId });
  // Cascade: delete tierlists and likes of this user
  const tierlists = await getCollection<TierListDoc>('tierlists');
  const likes = await getCollection('likes');
  await Promise.all([
    tierlists.deleteMany({ userId }),
    likes.deleteMany({ userId }),
  ]);
  return NextResponse.json({ deleted: res.deletedCount === 1 });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await ctx.params;
  let userId: ObjectId;
  try { userId = new ObjectId(id); } catch { return NextResponse.json({ error: 'Invalid id' }, { status: 400 }); }
  try {
    const body = await req.json();
    const role = body?.role as 'USER' | 'ADMIN' | undefined;
    if (role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    const users = await getCollection('users');
    const res = await users.updateOne({ _id: userId }, { $set: { role } });
    return NextResponse.json({ updated: res.modifiedCount === 1, role });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

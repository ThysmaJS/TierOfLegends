import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/authz';
import { ObjectId } from 'mongodb';
import type { TierListDoc } from '@/types/tierlist';

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await ctx.params;
  let tlId: ObjectId;
  try { tlId = new ObjectId(id); } catch { return NextResponse.json({ error: 'Invalid id' }, { status: 400 }); }

  const col = await getCollection<TierListDoc>('tierlists');
  const res = await col.deleteOne({ _id: tlId });
  const likes = await getCollection('likes');
  await likes.deleteMany({ tierListId: tlId });
  return NextResponse.json({ deleted: res.deletedCount === 1 });
}

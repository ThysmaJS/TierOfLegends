import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/authz';
import type { TierListDoc } from '@/types/tierlist';

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const col = await getCollection<TierListDoc>('tierlists');
  const list = await col.find({}, { projection: { title: 1, category: 1, userId: 1, likes: 1, createdAt: 1, updatedAt: 1, coverImageUrl: 1 } }).toArray();
  return NextResponse.json({
    tierlists: list.map(t => ({
      id: t._id.toString(),
      title: t.title,
      category: t.category,
      userId: t.userId.toString(),
      likes: t.likes ?? 0,
  coverImageUrl: t.coverImageUrl,
  createdAt: t.createdAt?.toISOString?.() ?? undefined,
      updatedAt: t.updatedAt?.toISOString?.() ?? undefined,
    }))
  });
}

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/authz';
import type { TierListDoc } from '@/types/tierlist';
import type { ObjectId } from 'mongodb';

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const col = await getCollection<TierListDoc>('tierlists');
  const raw = await col.aggregate([
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'author' } },
    { $addFields: { author: { $arrayElemAt: ['$author', 0] } } },
    {
      $project: {
        title: 1,
        category: 1,
        userId: 1,
        likes: 1,
        coverImageUrl: 1,
        createdAt: 1,
        updatedAt: 1,
        authorUsername: '$author.username',
        authorEmail: '$author.email',
      }
    }
  ]).toArray() as Array<{
    _id: ObjectId;
    title: string;
    category?: string;
    userId: ObjectId;
    likes?: number;
    coverImageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    authorUsername?: string;
    authorEmail?: string;
  }>;
  const tierlists = raw.map(t => ({
    id: t._id.toString(),
    title: t.title,
    category: t.category,
    userId: t.userId.toString(),
    likes: t.likes ?? 0,
    coverImageUrl: t.coverImageUrl,
    authorUsername: t.authorUsername,
    authorEmail: t.authorEmail,
    createdAt: t.createdAt?.toISOString?.() ?? undefined,
    updatedAt: t.updatedAt?.toISOString?.() ?? undefined,
  }));
  return NextResponse.json({ tierlists });
}

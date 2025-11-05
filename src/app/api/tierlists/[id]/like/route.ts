import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { TierListDoc } from '@/types/tierlist';
import type { NextRequest } from 'next/server';
import { logger, errorMeta } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
    const colUsers = await getCollection<{ _id: ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const tlId = new ObjectId(id);
    const colLikes = await getCollection<{ _id?: ObjectId; userId: ObjectId; tierListId: ObjectId; createdAt: Date }>('likes');
    const now = new Date();
    const res = await colLikes.updateOne(
      { userId: dbUser._id, tierListId: tlId },
      { $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
    let inc = 0;
    if (res.upsertedId) inc = 1; // newly liked
    if (inc !== 0) {
      const colTl = await getCollection<TierListDoc>('tierlists');
      await colTl.updateOne({ _id: tlId }, { $inc: { likes: inc } });
    }
    // fetch updated count
  const colTl = await getCollection<TierListDoc>('tierlists');
  const doc = await colTl.findOne<{ likes: number }>({ _id: tlId }, { projection: { likes: 1 } });
    const likes = doc?.likes ?? 0;
    return Response.json({ liked: true, likes });
  } catch (err) {
    logger.error('POST /api/tierlists/[id]/like failed', { ...errorMeta(err) });
    return new Response('Erreur serveur', { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
    const colUsers = await getCollection<{ _id: ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const tlId = new ObjectId(id);
    const colLikes = await getCollection<{ userId: ObjectId; tierListId: ObjectId }>('likes');
    const del = await colLikes.deleteOne({ userId: dbUser._id, tierListId: tlId });
    if (del.deletedCount === 1) {
      const colTl = await getCollection<TierListDoc>('tierlists');
      await colTl.updateOne({ _id: tlId }, { $inc: { likes: -1 } });
    }
  const colTl = await getCollection<TierListDoc>('tierlists');
  const doc = await colTl.findOne<{ likes: number }>({ _id: tlId }, { projection: { likes: 1 } });
    const likes = doc?.likes ?? 0;
    return Response.json({ liked: false, likes });
  } catch (err) {
    logger.error('DELETE /api/tierlists/[id]/like failed', { ...errorMeta(err) });
    return new Response('Erreur serveur', { status: 500 });
  }
}

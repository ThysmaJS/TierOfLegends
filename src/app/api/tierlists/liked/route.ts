import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
    const colUsers = await getCollection<{ _id: ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });
    const colLikes = await getCollection<{ userId: ObjectId; tierListId: ObjectId }>('likes');
    const liked = await colLikes.find({ userId: dbUser._id }).toArray();
    const ids = liked.map(l => l.tierListId);
    if (ids.length === 0) return Response.json({ tierlists: [] });
    const colTl = await getCollection<TierListDoc>('tierlists');
    const docs = await colTl.find({ _id: { $in: ids } }, { sort: { updatedAt: -1 } }).toArray();
    const data = docs.map(d => ({
      id: d._id.toString(),
      title: d.title,
      category: d.category ?? 'champion-skins',
      categoryMeta: d.categoryMeta,
      championId: d.championId,
      coverImageUrl: d.coverImageUrl,
      coverMode: d.coverMode,
      tiers: d.tiers,
      likes: d.likes ?? 0,
      views: d.views ?? 0,
      updatedAt: d.updatedAt.toISOString(),
      likedByMe: true,
    }));
    return Response.json({ tierlists: data });
  } catch {
    return new Response('Erreur serveur', { status: 500 });
  }
}

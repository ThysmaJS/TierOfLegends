import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.email) return new Response('Unauthorized', { status: 401 });
    const colUsers = await getCollection<{ _id: import('mongodb').ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });
    const col = await getCollection<TierListDoc>('tierlists');
    const docs = await col.find({ userId: dbUser._id }, { sort: { updatedAt: -1 } }).toArray();
    const data = docs.map(d => ({
      id: d._id.toString(),
      title: d.title,
      championId: d.championId,
      tiers: d.tiers,
      likes: d.likes ?? 0,
      views: d.views ?? 0,
      updatedAt: d.updatedAt.toISOString(),
    }));
    return Response.json({ tierlists: data });
  } catch (err) {
    return new Response('Erreur serveur', { status: 500 });
  }
}

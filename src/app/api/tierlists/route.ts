import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { z } from 'zod';
import type { TierListDoc } from '@/types/tierlist';

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  championId: z.string().trim().min(1),
  tiers: z.array(z.object({ name: z.string(), items: z.array(z.string()) })).min(1),
});

export async function GET() {
  try {
    const col = await getCollection<TierListDoc>('tierlists');
    const docs = await col.find({}, { sort: { updatedAt: -1 }, limit: 60 }).toArray();
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
  } catch {
    return new Response('Erreur serveur', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) return new Response('Unauthorized', { status: 401 });
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

    const colUsers = await getCollection<{ _id: import('mongodb').ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });

    const now = new Date();
    const col = await getCollection<TierListDoc>('tierlists');
    const insert = await col.insertOne({
      userId: dbUser._id,
      title: parsed.data.title,
      championId: parsed.data.championId,
      tiers: parsed.data.tiers,
      likes: 0,
      views: 0,
      createdAt: now,
      updatedAt: now,
    } as unknown as TierListDoc);

    return Response.json({ id: insert.insertedId.toString() }, { status: 201 });
  } catch {
    return new Response('Erreur serveur', { status: 500 });
  }
}

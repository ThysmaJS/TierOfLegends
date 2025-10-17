import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { z } from 'zod';
import type { TierListDoc, TierListCreateInput } from '@/types/tierlist';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.enum(['champion-skins','items','summoner-spells','runes']).optional(),
  championId: z.string().trim().min(1).optional(),
  categoryMeta: z.record(z.string(), z.unknown()).optional(),
  tiers: z.array(z.object({ name: z.string(), items: z.array(z.string()) })).min(1),
}).superRefine((d, ctx) => {
  const cat = d.category ?? 'champion-skins';
  if (cat === 'champion-skins' && !d.championId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'championId requis pour la catégorie champion-skins', path: ['championId'] });
  }
});

export async function GET() {
  try {
    const col = await getCollection<TierListDoc>('tierlists');
    const docs = await col.find({}, { sort: { updatedAt: -1 }, limit: 60 }).toArray();
    const data = docs.map(d => ({
      id: d._id.toString(),
      title: d.title,
      category: d.category ?? 'champion',
      categoryMeta: d.categoryMeta,
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

export async function POST(req: NextRequest) {
  try {
    // Prefer JWT token lookup for reliability on Vercel
    const token = await getToken({ req });
    const email = (token?.email as string | undefined) || (await auth())?.user?.email || undefined;
    if (!email) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse(body as TierListCreateInput);
    if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

    const colUsers = await getCollection<{ _id: import('mongodb').ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });

    const now = new Date();
    const col = await getCollection<TierListDoc>('tierlists');
    const insert = await col.insertOne({
      userId: dbUser._id,
      title: parsed.data.title,
  category: parsed.data.category ?? 'champion-skins',
      categoryMeta: parsed.data.categoryMeta,
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

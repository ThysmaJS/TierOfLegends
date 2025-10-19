import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { z } from 'zod';
import type { TierListDoc, TierListCreateInput } from '@/types/tierlist';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cachedChampionDetails, cachedItemList, cachedRunesKeystones, cachedSummonerSpells } from '@/lib/riot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.enum(['champion-skins','items','summoner-spells','runes']).optional(),
  championId: z.string().trim().min(1).optional(),
  categoryMeta: z.record(z.string(), z.unknown()).optional(),
  coverImageUrl: z.string().url().optional(),
  coverMode: z.enum(['manual','random']).optional(),
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
      coverImageUrl: d.coverImageUrl,
      coverMode: d.coverMode,
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
    // Compute cover if needed
    let coverImageUrl: string | undefined = parsed.data.coverImageUrl;
    const coverMode = parsed.data.coverMode ?? (parsed.data.coverImageUrl ? 'manual' : 'random');
    if (!coverImageUrl && coverMode === 'random') {
      try {
        const cat = parsed.data.category ?? 'champion-skins';
        // Use a deterministic seed from title+category+championId to pick an item consistently
        const seedSource = `${parsed.data.title}|${cat}|${parsed.data.championId ?? ''}`;
        let seed = 0;
        for (let i = 0; i < seedSource.length; i++) seed = (seed * 31 + seedSource.charCodeAt(i)) >>> 0;
        function pick<T>(arr: T[]): T | undefined { return arr.length ? arr[seed % arr.length] : undefined; }
        if (cat === 'champion-skins' && parsed.data.championId) {
          const cj = await cachedChampionDetails(parsed.data.championId, 'fr_FR');
          const skins: Array<{ loading: string; splash?: string }> = cj.skins || [];
          const pool: string[] = skins.filter((s: { loading: string; splash?: string }) => !!s.splash).map((s) => s.splash!)
          const altPool: string[] = skins.map((s: { loading: string; splash?: string }) => s.loading)
          coverImageUrl = pick(pool) || pick(altPool);
        } else if (cat === 'items' || cat === 'summoner-spells' || cat === 'runes') {
          // Use only the category visuals (icons) — never champion skins here
          const deck = (parsed.data.tiers || []).find(t => t.name === 'Deck');
          const fromDeck = deck && deck.items && deck.items.length ? pick(deck.items) : undefined;
          if (fromDeck) coverImageUrl = fromDeck;
          if (!coverImageUrl) {
            if (cat === 'items') {
              const list = await cachedItemList('fr_FR');
              coverImageUrl = pick(list.map(i => i.image));
            } else if (cat === 'summoner-spells') {
              const spells = await cachedSummonerSpells('fr_FR');
              coverImageUrl = pick(spells.map(s => s.image));
            } else {
              const runes = await cachedRunesKeystones('fr_FR');
              coverImageUrl = pick(runes.map(r => r.icon));
            }
          }
        }
      } catch {}
    }

    const insert = await col.insertOne({
      userId: dbUser._id,
      title: parsed.data.title,
  category: parsed.data.category ?? 'champion-skins',
      categoryMeta: parsed.data.categoryMeta,
      championId: parsed.data.championId,
      coverImageUrl,
      coverMode,
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

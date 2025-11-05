import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth } from '@/auth';
import { z, ZodError } from 'zod';
import { ObjectId } from 'mongodb';
import { logger, errorMeta } from '@/lib/logger';

const Schema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).optional(),
  avatarUrl: z.string().trim().url().or(z.literal('')).transform(v => v || undefined).optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { username, avatarUrl } = Schema.parse(body);

    if (username === undefined && avatarUrl === undefined) {
      return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 });
    }

    const users = await getCollection<{ _id: ObjectId; email: string; username?: string; avatarUrl?: string }>('users');

    if (username !== undefined) {
      const exists = await users.findOne({ username, email: { $ne: session.user.email } });
      if (exists) return NextResponse.json({ error: 'Pseudo déjà pris' }, { status: 409 });
    }

    const $set: Record<string, unknown> = {};
    if (username !== undefined) $set.username = username;
    if (avatarUrl !== undefined) $set.avatarUrl = avatarUrl;

    const res = await users.updateOne(
      { email: session.user.email },
      { $set },
      { upsert: false }
    );

    if (res.matchedCount === 0) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues.map(i=>i.message).join(', ') }, { status: 400 });
    logger.error('PATCH /api/profile failed', { ...errorMeta(e) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

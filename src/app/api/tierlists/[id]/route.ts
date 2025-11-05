import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { logger, errorMeta } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = await getToken({ req: _ });
    const email = (token?.email as string | undefined) || (await auth())?.user?.email || undefined;
    if (!email) return new Response('Unauthorized', { status: 401 });

    const { ObjectId } = await import('mongodb');
    const colUsers = await getCollection<{ _id: import('mongodb').ObjectId; email: string }>('users');
  const dbUser = await colUsers.findOne({ email: email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });

    const col = await getCollection<TierListDoc>('tierlists');
    const res = await col.deleteOne({ _id: new ObjectId(id), userId: dbUser._id });
    if (res.deletedCount === 0) return new Response('Not Found', { status: 404 });
    return new Response(null, { status: 204 });
  } catch (err) {
    logger.error('DELETE /api/tierlists/[id] failed', { ...errorMeta(err) });
    return new Response('Erreur serveur', { status: 500 });
  }
}

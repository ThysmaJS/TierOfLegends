import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import type { NextRequest } from 'next/server';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });

    const { ObjectId } = await import('mongodb');
    const colUsers = await getCollection<{ _id: import('mongodb').ObjectId; email: string }>('users');
    const dbUser = await colUsers.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) return new Response('Unauthorized', { status: 401 });

    const col = await getCollection<TierListDoc>('tierlists');
    const res = await col.deleteOne({ _id: new ObjectId(id), userId: dbUser._id });
    if (res.deletedCount === 0) return new Response('Not Found', { status: 404 });
    return new Response(null, { status: 204 });
  } catch {
    return new Response('Erreur serveur', { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth } from '@/auth';
import { z, ZodError } from 'zod';
import { ObjectId } from 'mongodb';

const Schema = z.object({ email: z.string().trim().toLowerCase().email('Email invalide') });

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { email } = Schema.parse(body);

    const users = await getCollection<{ _id: ObjectId; email: string }>('users');

    const exists = await users.findOne({ email });
    if (exists && exists.email !== session.user.email) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }

    const res = await users.updateOne(
      { email: session.user.email },
      { $set: { email } }
    );

    if (res.matchedCount === 0) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues.map(i=>i.message).join(', ') }, { status: 400 });
    console.error('Profile email update error', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { z, ZodError } from 'zod';
import type { MongoServerError } from 'mongodb';

const PasswordSchema = z.string()
  .min(8, 'Au moins 8 caractères')
  .max(64, 'Au plus 64 caractères')
  .regex(/[a-z]/, 'Une minuscule requise')
  .regex(/[A-Z]/, 'Une majuscule requise')
  .regex(/[0-9]/, 'Un chiffre requis')
  .regex(/[^A-Za-z0-9]/, 'Un caractère spécial requis')
  .refine((v) => !/\s/.test(v), { message: 'Pas d\'espaces' });

// Normalize inputs to avoid edge-cases (leading/trailing spaces, case differences)
const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide'),
  username: z.string()
    .trim()
    .toLowerCase()
    .min(3, 'Pseudo trop court')
    .max(20, 'Pseudo trop long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Uniquement lettres, chiffres et underscore'),
  password: PasswordSchema,
});

type UserDoc = {
  _id?: string;
  email: string;
  username?: string; // make optional to accommodate legacy docs
  passwordHash: string;
  role?: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username } = RegisterSchema.parse(body);

    const users = await getCollection<UserDoc>('users');

    // Ensure indexes exist, but don't break the request if index creation fails
    try {
      await users.createIndex({ email: 1 }, { unique: true, name: 'unique_email' });
    } catch (idxErr) {
      if (process.env.NODE_ENV !== 'production') console.warn('Email index warning:', idxErr);
    }

    // Migrate legacy bad unique index on `username` (without partial filter)
    try {
      const indexes = await users.listIndexes().toArray() as Array<{
        name: string;
        key: Record<string, 1 | -1>;
        unique?: boolean;
        partialFilterExpression?: Record<string, unknown>;
      }>;
      const badUsernameIdx = indexes.find((i) => i.key['username'] === 1 && i.unique === true && !i.partialFilterExpression);
      if (badUsernameIdx) {
        await users.dropIndex(badUsernameIdx.name);
        if (process.env.NODE_ENV !== 'production') console.warn('Dropped legacy username unique index:', badUsernameIdx.name);
      }
    } catch (idxErr) {
      if (process.env.NODE_ENV !== 'production') console.warn('Index inspection warning:', idxErr);
    }

    try {
      // Partial index to avoid duplicate key on legacy docs without `username`
      await users.createIndex(
        { username: 1 },
        {
          unique: true,
          name: 'unique_username_partial',
          partialFilterExpression: { username: { $type: 'string' } },
        }
      );
    } catch (idxErr) {
      if (process.env.NODE_ENV !== 'production') console.warn('Username index warning:', idxErr);
    }

    // Explicit duplicate checks
    const [emailDoc, usernameDoc] = await Promise.all([
      users.findOne({ email }),
      users.findOne({ username }),
    ]);

    if (emailDoc || usernameDoc) {
      const detail = process.env.NODE_ENV !== 'production' ? { emailDocId: emailDoc?._id, usernameDocId: usernameDoc?._id } : undefined;
      if (emailDoc) {
        return NextResponse.json({ error: { fieldErrors: { email: ['Email déjà enregistré'] }, formErrors: [] }, ...(detail ? { detail } : {}) }, { status: 409 });
      }
      return NextResponse.json({ error: { fieldErrors: { username: ['Pseudo déjà pris'] }, formErrors: [] }, ...(detail ? { detail } : {}) }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();
  const doc: UserDoc = { email, username, passwordHash, role: 'USER', createdAt: now, updatedAt: now };
    const result = await users.insertOne(doc);

    return NextResponse.json({ id: result.insertedId.toString(), email: doc.email, username: doc.username }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues.map((i) => i.message).join(', ') }, { status: 400 });
    }
    // Handle duplicate key error without using `any`
    type DupErrorDetails = { keyPattern?: Record<string, number>; keyValue?: Record<string, unknown> };
    if (typeof e === 'object' && e && 'code' in e && (e as MongoServerError).code === 11000) {
      const dup = e as MongoServerError & DupErrorDetails;
      const keyPattern = dup.keyPattern;
      let msg = 'Email ou pseudo déjà utilisé';
      if (keyPattern) {
        if ('email' in keyPattern) msg = 'Email déjà enregistré';
        else if ('username' in keyPattern) msg = 'Pseudo déjà pris';
      }
      const detail = process.env.NODE_ENV !== 'production' ? { keyPattern: dup.keyPattern, keyValue: dup.keyValue } : undefined;
      const fieldKey = msg.includes('Email') ? 'email' : (msg.includes('Pseudo') ? 'username' : '');
      const payload = fieldKey ? { fieldErrors: { [fieldKey]: [msg] }, formErrors: [] } : { fieldErrors: {}, formErrors: [msg] };
      return NextResponse.json({ error: payload, ...(detail ? { detail } : {}) }, { status: 409 });
    }
    const message = e instanceof Error ? e.message : 'Failed to register';
    console.error('Register error', e);
    const payload: { error: { fieldErrors: Record<string, string[]>; formErrors: string[] }; detail?: string } = { error: { fieldErrors: {}, formErrors: ['Failed to register'] } };
    if (process.env.NODE_ENV !== 'production') payload.detail = message;
    return NextResponse.json(payload, { status: 500 });
  }
}

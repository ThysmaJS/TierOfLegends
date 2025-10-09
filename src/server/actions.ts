"use server";

import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

type UserDoc = { _id?: string; email: string; passwordHash: string };

export async function createUser(email: string, password: string) {
  const users = await getCollection<UserDoc>('users');
  const existing = await users.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('User exists');
  const passwordHash = await bcrypt.hash(password, 10);
  await users.insertOne({ email: email.toLowerCase(), passwordHash });
  return true;
}

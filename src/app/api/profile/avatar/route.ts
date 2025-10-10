import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  // For demo: we create an object URL-like data URL. In production, upload to storage (S3/Bucket) and save the public URL.
  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const base64 = bytes.toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  const users = await getCollection<{ _id: ObjectId; email: string; avatarUrl?: string }>('users');
  await users.updateOne({ email: session.user.email }, { $set: { avatarUrl: dataUrl } });

  return NextResponse.json({ ok: true, avatarUrl: dataUrl });
}

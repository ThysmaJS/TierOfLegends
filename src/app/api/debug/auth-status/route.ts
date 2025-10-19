import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

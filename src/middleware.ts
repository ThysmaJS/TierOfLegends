import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  // Kill switch: allow disabling auth checks in production temporarily
  if (process.env.DISABLE_AUTH === 'true') {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    const originalPath = req.nextUrl.pathname + (req.nextUrl.search || '');
    // Use NextAuth-compatible param name so the login page and NextAuth can redirect correctly
    url.searchParams.set('callbackUrl', originalPath);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/tier-lists/new'],
};

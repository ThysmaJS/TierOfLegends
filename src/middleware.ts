import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    const originalPath = req.nextUrl.pathname + (req.nextUrl.search || '');
    url.searchParams.set('next', originalPath);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profil/:path*', '/tier-lists/new'],
};

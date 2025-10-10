import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: [
    '/profil/:path*',
    '/tier-lists/new/:path*',
  ],
};

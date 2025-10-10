import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: [
    // Protect only private routes
    '/profil/:path*',
    '/tier-lists/new/:path*',
  ],
};

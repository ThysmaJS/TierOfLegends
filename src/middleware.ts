import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
  callbacks: {
    // Autorise l'accès si un token (JWT) est présent, avec fallback basé sur la présence du cookie de session
    authorized: ({ token, req }) => {
      if (token) return true;
      try {
        const cookie = req.cookies.get('__Secure-next-auth.session-token') || req.cookies.get('next-auth.session-token');
        return !!cookie;
      } catch {
        return false;
      }
    },
  },
});

export const config = {
  matcher: [
    // Protect only private routes
    '/profil/:path*',
    '/tier-lists/new/:path*',
  ],
};

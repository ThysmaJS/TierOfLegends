// Helper to determine the absolute site URL for metadata routes
// Priority: NEXTAUTH_URL > VERCEL_URL > localhost
export function getSiteUrl(): string {
  const fromNextAuth = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (fromNextAuth) return fromNextAuth;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

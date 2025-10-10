export function sanitizeCallbackUrl(raw: string | null | undefined, origin: string): string {
  const fallback = "/";
  if (!raw) return fallback;
  try {
    const u = new URL(raw, origin);
    if (u.pathname.startsWith("/login") || u.pathname.startsWith("/register")) return fallback;
    if (u.origin !== origin) return fallback;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    if (!raw.startsWith("/")) return fallback;
    if (raw.startsWith("/login") || raw.startsWith("/register")) return fallback;
    return raw;
  }
}

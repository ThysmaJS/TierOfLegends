export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profil/:path*",
    "/tier-lists/new/:path*",
  ],
};

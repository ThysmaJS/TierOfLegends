import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "../components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tier of Legends - Skins Tier Lists",
  description: "Créez et partagez vos tier lists des skins League of Legends. Classez vos skins favoris et découvrez les préférences de la communauté.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-900 text-white relative`}
      >
        {/* Global decorative background (subtle gradients) */}
        <div aria-hidden="true" className="pointer-events-none select-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[55vw] h-[55vw] bg-gradient-to-tl from-fuchsia-500/20 via-indigo-700/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_60%)]" />
        </div>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { NextConfig } from "next";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  // Force Turbopack root to this workspace to avoid picking C:\Users\mathy due to an extra lockfile
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/**'
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/img/champion/**'
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/img/champion/loading/**'
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/cdn/img/champion/splash/**'
      }
    ]
  },
  experimental: {
    authInterrupts: true
  },
  async redirects() {
    return [
      {
        source: '/profil/edit',
        destination: '/profil',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;

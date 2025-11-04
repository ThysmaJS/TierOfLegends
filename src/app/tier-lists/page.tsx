import Link from 'next/link';
import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { TierListDoc } from '@/types/tierlist';
import TierListFilters from '@/components/tierlist/TierListFilters';
import ClientFilteredGrid from '@/app/tier-lists/pageClient';

export const metadata = {
  title: 'Tier Lists Communauté — Tier of Legends',
  description: 'Explore les tier lists créées par la communauté League of Legends et filtre par catégorie.',
  alternates: { canonical: '/tier-lists' },
  openGraph: {
    type: 'website',
    url: '/tier-lists',
    title: 'Tier Lists Communauté — Tier of Legends',
    description: 'Explore les tier lists créées par la communauté League of Legends et filtre par catégorie.',
    images: [{ url: '/window.svg', width: 1200, height: 630, alt: 'Tier of Legends' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tier Lists Communauté — Tier of Legends',
    description: 'Explore les tier lists créées par la communauté League of Legends et filtre par catégorie.',
    images: ['/window.svg'],
  },
} as const;

async function getTierLists() {
  const col = await getCollection<TierListDoc>('tierlists');
  const docs = await col.find({}, { sort: { updatedAt: -1 }, limit: 60 }).toArray();

  // Determine likedByMe for current user
  const session = await auth();
  let likedSet = new Set<string>();
  if (session?.user?.email) {
    try {
      const usersCol = await getCollection<{ _id: ObjectId; email: string }>('users');
      const dbUser = await usersCol.findOne({ email: session.user.email.toLowerCase() });
      if (dbUser) {
        const likesCol = await getCollection<{ userId: ObjectId; tierListId: ObjectId }>('likes');
        const likes = await likesCol.find({ userId: dbUser._id }).toArray();
        likedSet = new Set(likes.map(l => l.tierListId.toString()));
      }
    } catch {}
  }

  return docs.map(d => ({
    id: d._id.toString(),
    title: d.title,
    category: d.category ?? 'champion-skins',
    championId: d.championId,
    coverImageUrl: d.coverImageUrl,
  description: `${d.category ?? 'champion-skins'}`,
    views: d.views ?? 0,
    likes: d.likes ?? 0,
    createdAt: d.createdAt.toISOString(),
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-purple-500',
    previewText: (d.championId || d.category || 'TL').slice(0,4).toUpperCase(),
    updatedAt: d.updatedAt.toISOString(),
    likedByMe: likedSet.has(d._id.toString()),
  }));
}

export default async function TierListPage() {
  const session = await auth();
  const isAuthed = !!session;
  const tierLists = await getTierLists();
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Tier Lists <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Communauté</span>
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base">
              Explore les classements créés par la communauté ou lance-toi et crée ta propre tier list
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {isAuthed && (
              <Link href="/tier-lists/new" className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-colors">
                + Créer une Tier List
              </Link>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-8">
          <TierListFilters />
        </div>

        {/* Stats globales (mock) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-400">{tierLists.length}</div>
            <div className="text-xs uppercase tracking-wide text-gray-400">Tier Lists</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-400">{tierLists.reduce((acc,t)=>acc+t.likes,0)}</div>
            <div className="text-xs uppercase tracking-wide text-gray-400">Likes cumulés</div>
          </div>
            {/* Vues retirées */}
        </div>

        <ClientFilteredGrid tierLists={tierLists} />
      </div>
    </div>
  );
}

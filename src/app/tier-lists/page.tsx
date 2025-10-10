import Link from 'next/link';
import { TierListCard } from '@/components/tierlist';
import { auth } from '@/auth';

interface TierListPreview {
  id: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  gradientFrom: string;
  gradientTo: string;
  previewText: string;
  updatedAt: string;
}

// Mock local (remplacer plus tard par appel DB / API route)
const tierLists: TierListPreview[] = [
  {
    id: 'tl1',
    title: 'Skins Ahri Préférés',
    description: 'Classement personnel des skins Ahri',
    views: 1280,
    likes: 340,
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-500',
    previewText: 'AHRI',
    updatedAt: '2025-10-01'
  },
  {
    id: 'tl2',
    title: 'Lux Élémentaliste Meta',
    description: 'Feeling et animations en jeu',
    views: 860,
    likes: 210,
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-pink-400',
    previewText: 'LUX',
    updatedAt: '2025-09-28'
  },
  {
    id: 'tl3',
    title: 'Yasuo Style Ranking',
    description: 'Style & fluidité des animations',
    views: 640,
    likes: 150,
    gradientFrom: 'from-gray-700',
    gradientTo: 'to-indigo-500',
    previewText: 'YASU',
    updatedAt: '2025-09-20'
  }
].sort((a,b)=> b.views - a.views);

export default async function TierListPage() {
  const session = await auth();
  const isAuthed = !!session;
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
              Explore les classements créés par la communauté ou lance-toi et crée ta propre tier list de skins.
            </p>
          </div>
          <div className="flex gap-3">
            {isAuthed && (
              <Link href="/tier-lists/new" className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-colors">
                + Créer une Tier List
              </Link>
            )}
          </div>
        </div>

        {/* Stats globales (mock) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-400">{tierLists.length}</div>
            <div className="text-xs uppercase tracking-wide text-gray-400">Tier Lists</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-400">{tierLists.reduce((acc,t)=>acc+t.likes,0)}</div>
            <div className="text-xs uppercase tracking-wide text-gray-400">Likes cumulés</div>
          </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-400">{tierLists.reduce((acc,t)=>acc+t.views,0)}</div>
            <div className="text-xs uppercase tracking-wide text-gray-400">Vues cumulées</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tierLists.map(tl => (
            <TierListCard
              key={tl.id}
              title={tl.title}
              description={tl.description}
              views={tl.views}
              likes={tl.likes}
              gradientFrom={tl.gradientFrom}
              gradientTo={tl.gradientTo}
              previewText={tl.previewText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

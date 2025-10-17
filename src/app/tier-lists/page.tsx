import Link from 'next/link';
import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import TierListFilters from '@/components/tierlist/TierListFilters';
import ClientFilteredGrid from '@/app/tier-lists/pageClient';

async function getTierLists() {
  const col = await getCollection<TierListDoc>('tierlists');
  const docs = await col.find({}, { sort: { updatedAt: -1 }, limit: 60 }).toArray();
  return docs.map(d => ({
    id: d._id.toString(),
    title: d.title,
    category: d.category ?? 'champion-skins',
    championId: d.championId,
    description: `${d.tiers[0]?.items.length ?? 0} items classés · ${d.category ?? 'champion-skins'}`,
    views: d.views ?? 0,
    likes: d.likes ?? 0,
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-purple-500',
    previewText: (d.championId || d.category || 'TL').slice(0,4).toUpperCase(),
    updatedAt: d.updatedAt.toISOString(),
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
              <TierListFilters />
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

        <ClientFilteredGrid tierLists={tierLists} />
      </div>
    </div>
  );
}

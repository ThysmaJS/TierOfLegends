import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import { TierListCard } from '@/components/tierlist';

export const revalidate = 600; // rafraîchit toutes les 10 min

export const metadata = {
  title: 'Tier of Legends - Crée et partage des Tier Lists LoL',
  description: 'Classe tes skins, objets, sorts et runes de League of Legends, découvre les listes de la communauté et partage les tiennes.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Tier of Legends - Crée et partage des Tier Lists LoL',
    description: 'Classe tes skins, objets, sorts et runes de League of Legends, découvre les listes de la communauté et partage les tiennes.',
    images: [{ url: '/window.svg', width: 1200, height: 630, alt: 'Tier of Legends' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tier of Legends - Crée et partage des Tier Lists LoL',
    description: 'Classe tes skins, objets, sorts et runes de League of Legends, découvre les listes de la communauté et partage les tiennes.',
    images: ['/window.svg'],
  },
} as const;

async function getHomeStats() {
  const col = await getCollection<TierListDoc>('tierlists');
  const docs = await col.find({}, { sort: { updatedAt: -1 }, limit: 6 }).toArray();
  const count = await col.countDocuments();
  const likes = docs.reduce((acc, t) => acc + (t.likes ?? 0), 0);
  const highlights = docs.map(d => ({
    id: d._id.toString(),
    title: d.title,
  description: `${d.category ?? 'champion-skins'}`,
  views: 0,
    likes: d.likes ?? 0,
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-purple-500',
    previewText: (d.championId || d.category || 'TL').slice(0,4).toUpperCase(),
    championId: d.championId,
    coverImageUrl: d.coverImageUrl,
    coverMode: d.coverMode,
  }));
  return { count, likes, views: 0, highlights };
}

export default async function Home() {
  const { count, likes, highlights } = await getHomeStats();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-28">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="text-white font-bold text-2xl">TL</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                Classe tes <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">skins, objets, sorts et runes</span> LoL
              </h1>
              <p className="text-lg lg:text-xl text-gray-300">
                Crée des tier lists, sauvegarde-les, et explore celles de la communauté.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tier-lists" className="inline-flex items-center px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium">
                Explorer les Tier Lists
              </Link>
              <Link href="/tier-lists/new" className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">
                + Créer une Tier List
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-6">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="text-center border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400 mb-1">{count}</div>
              <div className="text-gray-300 text-sm">Tier Lists publiées</div>
            </Card>
            <Card className="text-center border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-400 mb-1">{likes}</div>
              <div className="text-gray-300 text-sm">Likes cumulés</div>
            </Card>
            {/* Vues retirées */}
          </div>
        </Container>
      </section>

      {/* Catégories */}
      <section className="py-12 bg-white/5 backdrop-blur-sm border-t border-b border-white/10">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Catégories disponibles</h2>
            <p className="text-gray-300 text-sm mt-2">Données officielles Riot (Data Dragon), localisées en français.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'champion-skins', title: 'Skins de champions', desc: 'Toutes les variantes visuelles par champion.' },
              { key: 'items', title: 'Objets', desc: 'Objets finaux, composants, bottes, consommables.' },
              { key: 'summoner-spells', title: 'Sorts d\u0027invocateur', desc: 'Flash, Téléportation, Fatigue, etc.' },
              { key: 'runes', title: 'Runes (Keystones)', desc: 'Précision, Domination, Sorcellerie, etc.' },
            ].map((c) => (
              <Card key={c.key} className="p-5 border border-white/10 bg-white/5">
                <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{c.desc}</p>
                <Link href="/tier-lists/new" className="inline-flex items-center px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm">Créer</Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Dernières Tier Lists */}
      <section className="py-12">
        <Container>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Dernières tier lists</h2>
            <Link href="/tier-lists" className="text-sm text-blue-400 hover:text-blue-300">Tout voir</Link>
          </div>
          {highlights.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune tier list publiée pour le moment.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map(h => (
                <TierListCard key={h.id} hideActions {...h} imageUrl={h.coverImageUrl || undefined} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Comment ça marche */}
      <section className="py-12 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Comment ça marche ?</h2>
            <p className="text-gray-300 text-sm mt-2">Glisse-dépose, sauvegarde instantanée, et partage avec la communauté.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">1. Choisis la catégorie</h3>
              <p className="text-gray-300 text-sm">Skins de champion, objets, sorts d\u0027invocateur, ou runes (FR).</p>
            </Card>
            <Card className="text-center p-6 bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">2. Classe par tiers</h3>
              <p className="text-gray-300 text-sm">Tiers S à E, visuels HQ (splash/loading) et informations détaillées.</p>
            </Card>
            <Card className="text-center p-6 bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">3. Sauvegarde & partage</h3>
              <p className="text-gray-300 text-sm">Connexion sécurisée, profil perso, et découverte des listes publiées.</p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}

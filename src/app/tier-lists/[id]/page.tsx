import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import Link from 'next/link';
import ClientTierListViewer from '@/app/tier-lists/[id]/viewer';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const col = await getCollection<TierListDoc>('tierlists');
  const { ObjectId } = await import('mongodb');
  const { id } = await params;
  const doc = await col.findOne({ _id: new ObjectId(id) });

  const title = doc ? `${doc.title} - Tier of Legends` : 'Tier list introuvable - Tier of Legends';
  const description = doc
    ? doc.category === 'champion-skins' && doc.championId
      ? `Tier list des skins de ${doc.championId} sur Tier of Legends.`
      : 'Découvrez cette tier list sur Tier of Legends.'
    : "La tier list demandée est introuvable.";

  return {
    title,
    description,
    alternates: { canonical: `/tier-lists/${id}` },
    openGraph: {
      type: 'article',
      url: `/tier-lists/${id}`,
      siteName: 'Tier of Legends',
      title,
      description,
      images: doc?.coverImageUrl
        ? [{ url: doc.coverImageUrl, width: 1200, height: 630, alt: doc.title }]
        : [{ url: '/window.svg', width: 1200, height: 630, alt: 'Tier of Legends' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: doc?.coverImageUrl ? [doc.coverImageUrl] : ['/window.svg'],
    },
  } satisfies Metadata;
}

export default async function TierListDetailPage({ params }: Props) {
  const col = await getCollection<TierListDoc>('tierlists');
  const { ObjectId } = await import('mongodb');
  const { id } = await params;
  const doc = await col.findOne({ _id: new ObjectId(id) });
  if (!doc) return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <p className="text-gray-300">Tier list introuvable.</p>
        <Link href="/tier-lists" className="text-blue-400 hover:text-blue-300">Retour</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">{doc.title}</h1>
          <Link href="/tier-lists" className="text-blue-400 hover:text-blue-300 text-sm">← Retour</Link>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 overflow-x-auto">
          <ClientTierListViewer data={doc.tiers} />
        </div>
      </div>
    </div>
  );
}

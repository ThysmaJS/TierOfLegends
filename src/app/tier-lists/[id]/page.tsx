import { getCollection } from '@/lib/mongodb';
import type { TierListDoc } from '@/types/tierlist';
import Link from 'next/link';
import ClientTierListViewer from '@/app/tier-lists/[id]/viewer';

interface Props { params: Promise<{ id: string }> }

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

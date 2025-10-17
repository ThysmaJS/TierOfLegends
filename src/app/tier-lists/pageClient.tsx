"use client";
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { TierListCard } from '@/components/tierlist';

type TL = {
  id: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  gradientFrom: string;
  gradientTo: string;
  previewText: string;
  championId?: string;
};

export default function ClientFilteredGrid({ tierLists }: { tierLists: TL[] }) {
  const q = useSelector((s: RootState) => s.filters.query).toLowerCase().trim();
  const filtered = q
    ? tierLists.filter((t) =>
        t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
    : tierLists;
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((tl) => (
        <TierListCard
          key={tl.id}
          id={tl.id}
          title={tl.title}
          description={tl.description}
          views={tl.views}
          likes={tl.likes}
          gradientFrom={tl.gradientFrom}
          gradientTo={tl.gradientTo}
          previewText={tl.previewText}
          championId={tl.championId}
          hideActions
        />
      ))}
    </div>
  );
}

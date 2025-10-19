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
  coverImageUrl?: string;
  createdAt?: string;
  category?: 'champion-skins' | 'items' | 'summoner-spells' | 'runes';
};

export default function ClientFilteredGrid({ tierLists }: { tierLists: TL[] }) {
  const q = useSelector((s: RootState) => s.filters.query).toLowerCase().trim();
  const cat = useSelector((s: RootState) => s.filters.category);
  const sortBy = useSelector((s: RootState) => s.filters.sortBy);
  const sortDir = useSelector((s: RootState) => s.filters.sortDir);
  let filtered = tierLists.filter((t) =>
    (q ? (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : true)
    && (cat ? t.category === cat : true)
  );
  filtered = filtered.slice().sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'likes') return (a.likes - b.likes) * dir;
    if (sortBy === 'title') return a.title.localeCompare(b.title) * dir;
    // createdAt default
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
    return (ad - bd) * dir;
  });
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((tl) => (
        <TierListCard
          key={tl.id}
          id={tl.id}
          title={tl.title}
          description={tl.description}
          views={0}
          likes={tl.likes}
          gradientFrom={tl.gradientFrom}
          gradientTo={tl.gradientTo}
          previewText={tl.previewText}
          championId={tl.championId}
          imageUrl={tl.coverImageUrl}
          createdAt={tl.createdAt}
          hideActions
        />
      ))}
    </div>
  );
}

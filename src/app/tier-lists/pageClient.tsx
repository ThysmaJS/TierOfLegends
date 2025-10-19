"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { TierListCard } from '@/components/tierlist';

type TL = {
  id: string;
  title: string;
  description: string;
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
  const [page, setPage] = React.useState(1);
  const pageSize = 12;
  const q = useSelector((s: RootState) => s.filters.query).toLowerCase().trim();
  const cat = useSelector((s: RootState) => s.filters.category);
  const sortBy = useSelector((s: RootState) => s.filters.sortBy);
  const sortDir = useSelector((s: RootState) => s.filters.sortDir);
  // Reset page when filters change
  React.useEffect(() => { setPage(1); }, [q, cat, sortBy, sortDir]);
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
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const curPage = Math.min(page, totalPages);
  const start = (curPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((tl) => (
        <TierListCard
          key={tl.id}
          id={tl.id}
          title={tl.title}
          description={tl.description}
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
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={curPage === 1}
          >
            Précédent
          </button>
          <span className="text-gray-300 text-sm">Page {curPage} / {totalPages}</span>
          <button
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={curPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </>
  );
}

"use client";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setQuery, clearFilters } from '@/store/slices/filtersSlice';

export default function TierListFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const query = useSelector((s: RootState) => s.filters.query);
  return (
    <div className="flex gap-2 items-center">
      <input
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        placeholder="Rechercher…"
        className="h-10 rounded-md bg-white/10 text-white placeholder:text-gray-400 px-3 outline-none ring-1 ring-white/15 focus:ring-blue-500/60"
      />
      {query && (
        <button
          type="button"
          onClick={() => dispatch(clearFilters())}
          className="h-10 px-3 rounded-md bg-white/10 hover:bg-white/20 text-sm"
        >
          Effacer
        </button>
      )}
    </div>
  );
}

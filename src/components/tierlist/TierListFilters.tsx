"use client";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setQuery, setCategory, setSortBy, setSortDir, clearFilters, type FiltersState } from '@/store/slices/filtersSlice';

export default function TierListFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const query = useSelector((s: RootState) => s.filters.query);
  const category = useSelector((s: RootState) => s.filters.category);
  const sortBy = useSelector((s: RootState) => s.filters.sortBy);
  const sortDir = useSelector((s: RootState) => s.filters.sortDir);
  return (
    <div className="p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-gray-400">Recherche</label>
          <input
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Rechercher…"
            className="h-10 rounded-md bg-black/30 text-white placeholder:text-gray-400 px-3 outline-none ring-1 ring-white/15 focus:ring-blue-500/60"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-gray-400">Catégorie</label>
          <select
            value={category}
            onChange={(e)=>dispatch(setCategory(e.target.value as FiltersState['category']))}
            className="h-10 rounded-md bg-black/30 text-white px-3 outline-none ring-1 ring-white/15 focus:ring-blue-500/60"
          >
            <option className="bg-gray-900" value="">Toutes</option>
            <option className="bg-gray-900" value="champion-skins">Skins</option>
            <option className="bg-gray-900" value="items">Objets</option>
            <option className="bg-gray-900" value="summoner-spells">Sorts</option>
            <option className="bg-gray-900" value="runes">Runes</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-gray-400">Trier par</label>
          <select
            value={sortBy}
            onChange={(e)=>dispatch(setSortBy(e.target.value as FiltersState['sortBy']))}
            className="h-10 rounded-md bg-black/30 text-white px-3 outline-none ring-1 ring-white/15 focus:ring-blue-500/60"
          >
            <option className="bg-gray-900" value="createdAt">Date de création</option>
            <option className="bg-gray-900" value="likes">Nombre de likes</option>
            <option className="bg-gray-900" value="title">Titre</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-gray-400">Ordre</label>
          <div className="flex gap-2">
            <select
              value={sortDir}
              onChange={(e)=>dispatch(setSortDir(e.target.value as FiltersState['sortDir']))}
              className="h-10 flex-1 rounded-md bg-black/30 text-white px-3 outline-none ring-1 ring-white/15 focus:ring-blue-500/60"
            >
              <option className="bg-gray-900" value="desc">Décroissant</option>
              <option className="bg-gray-900" value="asc">Croissant</option>
            </select>
            <button
              type="button"
              onClick={() => dispatch(clearFilters())}
              className="h-10 px-3 rounded-md bg-white/10 hover:bg-white/20 text-sm"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

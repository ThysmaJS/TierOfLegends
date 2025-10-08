"use client";

import React from 'react';
import { TierListMaker, type Tier } from 'react-tierlist';
import Link from 'next/link';

const BASE_TIERS = ['S', 'A', 'B', 'C', 'D'];

interface ChampionOption {
  id: string;
  name: string;
  image: string;
}

interface ApiChampionSummary {
  id: string; name: string; image: string;
}

interface ApiChampionsResponse { champions: ApiChampionSummary[] }

interface ApiChampionDetailsSkin { loading: string; splash?: string; name: string }
interface ApiChampionDetails { skins: ApiChampionDetailsSkin[] }

export default function CreateTierListPage() {
  const [championId, setChampionId] = React.useState('');
  const [tiers, setTiers] = React.useState<Tier[]>([]);
  const [title, setTitle] = React.useState('Nouvelle Tier List');
  const [champions, setChampions] = React.useState<ChampionOption[]>([]);
  const [loadingChampions, setLoadingChampions] = React.useState(true);
  const [loadingSkins, setLoadingSkins] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [championQuery, setChampionQuery] = React.useState('');
  const [openChampions, setOpenChampions] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [skinsMeta, setSkinsMeta] = React.useState<{ url: string; name: string; splash?: string }[]>([]);
  const [selectedSkin, setSelectedSkin] = React.useState<{ url: string; name: string; splash?: string } | null>(null);
  const lastFocusRef = React.useRef<HTMLElement | null>(null);
  const filteredChampions = React.useMemo(() => {
    if (!championQuery.trim()) return champions;
    const q = championQuery.toLowerCase();
    return champions.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [championQuery, champions]);

  // Gestion fermeture clic extérieur & ESC
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!openChampions) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenChampions(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenChampions(false);
      if (e.key === 'ArrowDown') setOpenChampions(true);
    }
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [openChampions]);

  // Fetch champions on mount
  React.useEffect(() => {
    async function loadChamps() {
      try {
        setLoadingChampions(true);
        const res = await fetch('/api/champions');
        if (!res.ok) throw new Error('Erreur chargement champions');
        const json: ApiChampionsResponse = await res.json();
        const mapped: ChampionOption[] = json.champions.map(c => ({ id: c.id, name: c.name, image: c.image }));
        setChampions(mapped);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingChampions(false);
      }
    }
    loadChamps();
  }, []);

  // Fetch skins when champion changes
  React.useEffect(() => {
    if (!championId) return;
    async function loadSkins() {
      try {
        setLoadingSkins(true);
        const res = await fetch(`/api/champions/${championId}`);
        if (!res.ok) throw new Error('Erreur chargement skins');
        const champ: ApiChampionDetails = await res.json();
        const deckItems: string[] = champ.skins.map(s => s.loading);
        setSkinsMeta(champ.skins.map(s => ({ url: s.loading, name: s.name, splash: s.splash })));
        setTiers([
          ...BASE_TIERS.map(name => ({ name, items: [] as string[] })),
          { name: 'Deck', items: deckItems }
        ]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingSkins(false);
      }
    }
    loadSkins();
  }, [championId]);

  function handleReset() {
    if (!championId) return;
    setChampionId(prev => prev);
    setTiers(prev => {
      const deck = prev.find(t => t.name === 'Deck');
      const deckItems = deck ? deck.items : [];
      return [
        ...BASE_TIERS.map(name => ({ name, items: [] as string[] })),
        { name: 'Deck', items: deckItems }
      ];
    });
  }

  function handleSave() {
    // mock save
    console.log('SAVE_TIER_LIST', { championId, title, tiers });
    alert('Tier List sauvegardée (mock) – voir console');
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Créer une Tier List</h1>
            <p className="text-gray-300 text-sm">Sélectionne un champion, classe ses skins, puis sauvegarde.</p>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Titre</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                  placeholder="Titre de la tier list"
                />
              </div>
              <div className="w-60">
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Champion</label>
                {loadingChampions ? (
                  <div className="text-sm text-gray-400">Chargement...</div>
                ) : error ? (
                  <div className="text-sm text-red-400">{error}</div>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <input
                      value={championQuery}
                      onChange={e => setChampionQuery(e.target.value)}
                      onFocus={() => setOpenChampions(true)}
                      aria-haspopup="listbox"
                      placeholder="Rechercher..."
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 placeholder:text-gray-400"
                    />
                    {championQuery && (
                      <button
                        type="button"
                        onClick={() => setChampionQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        aria-label="Effacer la recherche"
                      >×</button>
                    )}
                    {openChampions && (
                      <ul
                        role="listbox"
                        aria-label="Liste des champions"
                        className="absolute z-20 mt-1 max-h-56 overflow-y-auto w-full bg-black/70 backdrop-blur-md border border-white/15 rounded shadow-lg"
                      >
                        <li className="px-3 py-1 text-[10px] uppercase tracking-wide text-gray-400">{filteredChampions.length} résultats</li>
                        {filteredChampions.map(c => (
                          <li key={c.id} role="option" aria-selected={c.id === championId}>
                            <button
                              type="button"
                              onClick={() => { setChampionId(c.id); setChampionQuery(c.name); setOpenChampions(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors ${c.id === championId ? 'bg-blue-600/30' : ''}`}
                            >
                              {/* TODO: remplacer par <Image /> optimisé Next.js */}
                              <img src={c.image} alt="" className="w-6 h-6 rounded object-cover" />
                              <span className="truncate">{c.name}</span>
                            </button>
                          </li>
                        ))}
                        {filteredChampions.length === 0 && (
                          <li className="px-3 py-2 text-sm text-gray-400">Aucun résultat</li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium">Réinitialiser</button>
            <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium">Sauvegarder</button>
            <Link href="/tier-lists" className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium">Retour</Link>
          </div>
        </header>
        <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4 overflow-x-auto min-h-[200px]">
          <div
            className="relative"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'IMG') {
                const src = (target as HTMLImageElement).src;
                const meta = skinsMeta.find(m => m.url === src || (m.url && src.endsWith(m.url.split('/').pop() || '')));
                if (meta) {
                  lastFocusRef.current = document.activeElement as HTMLElement;
                  setSelectedSkin(meta);
                }
              }
            }}
          >
            {loadingSkins && (
              <div className="text-sm text-gray-400">Chargement des skins...</div>
            )}
            {!loadingSkins && championId && tiers.length > 0 && (
              <TierListMaker
                data={tiers}
                onChange={setTiers}
                config={{ rowHeight: 150, colors: ['#dc2626', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1'] }}
              />
            )}
          </div>
          {!championId && !loadingChampions && (
            <div className="text-sm text-gray-500">Sélectionne un champion pour charger les skins.</div>
          )}
        </div>

        {selectedSkin && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Skin ${selectedSkin.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => { setSelectedSkin(null); lastFocusRef.current?.focus(); }}
            />
            <div className="relative bg-gray-850 border border-gray-700 rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in">
              <button
                onClick={() => { setSelectedSkin(null); lastFocusRef.current?.focus(); }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Fermer la modal"
                autoFocus
              >×</button>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 bg-black/40 flex items-center justify-center">
                  {/* TODO: remplacer par <Image /> pour optimisation */}
                  <img
                    src={selectedSkin.splash || selectedSkin.url}
                    alt={selectedSkin.name}
                    className="max-h-[70vh] object-contain"
                  />
                </div>
                <div className="md:w-64 p-4 space-y-4 flex flex-col">
                  <h2 className="text-xl font-semibold leading-tight">{selectedSkin.name}</h2>
                  <p className="text-sm text-gray-400">Aperçu haute résolution du skin. (Cliquer dehors ou sur × pour fermer)</p>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => { setSelectedSkin(null); lastFocusRef.current?.focus(); }}
                      className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm font-medium"
                    >Fermer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="text-xs text-gray-400 pt-4">
          <p>Deck = skins disponibles. Glisse-dépose les images dans les tiers. Données live via Riot Data Dragon.</p>
        </footer>
      </div>
    </div>
  );
}

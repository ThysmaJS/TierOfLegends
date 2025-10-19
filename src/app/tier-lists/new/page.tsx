"use client";

import React from 'react';
import Image from 'next/image';
import { TierListMaker, type Tier } from 'react-tierlist';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FIXED_TIERS = ['S', 'A', 'B', 'C', 'D', 'E'] as const;

type Category = 'champion-skins' | 'items' | 'summoner-spells' | 'runes';
const CATEGORY_OPTIONS: { key: Category; label: string }[] = [
  { key: 'champion-skins', label: 'Skins d\'un champion' },
  { key: 'items', label: 'Objets' },
  { key: 'summoner-spells', label: 'Sorts d\'invocateur' },
  { key: 'runes', label: 'Runes (Keystones)' },
];

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
  const router = useRouter();
  const [category, setCategory] = React.useState<Category>('champion-skins');
  const [championId, setChampionId] = React.useState('');
  const [tiers, setTiers] = React.useState<Tier[]>([]);
  const [title, setTitle] = React.useState('Nouvelle Tier List');
  const [champions, setChampions] = React.useState<ChampionOption[]>([]);
  const [loadingChampions, setLoadingChampions] = React.useState(true);
  const [loadingSkins, setLoadingSkins] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // Form errors handling
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [formErrors, setFormErrors] = React.useState<string[]>([]);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [championQuery, setChampionQuery] = React.useState('');
  const [openChampions, setOpenChampions] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  type ItemMeta = {
    description?: string;
    icon?: string;
    id?: string;
    gold?: { base: number; total: number; sell: number; purchasable?: boolean };
    plaintext?: string;
    stats?: Record<string, number>;
    statsList?: string[];
    tags?: string[];
    shortDesc?: string;
    longDesc?: string;
  };
  const [skinsMeta, setSkinsMeta] = React.useState<{ url: string; name: string; splash?: string; meta?: ItemMeta }[]>([]);
  const [selectedSkin, setSelectedSkin] = React.useState<{ url: string; name: string; splash?: string; meta?: ItemMeta } | null>(null);
  const lastFocusRef = React.useRef<HTMLElement | null>(null);
  const scrollYRef = React.useRef(0);
  const [itemType, setItemType] = React.useState<'final' | 'component' | 'boots' | 'consumable' | 'trinket' | ''>('');
  const [itemMap, setItemMap] = React.useState<'sr' | 'aram' | ''>('');
  // Cover image controls
  const [coverMode, setCoverMode] = React.useState<'manual' | 'random'>('random');
  const [coverImageUrl, setCoverImageUrl] = React.useState<string>('');
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  

  // Pointer tracking to éviter l'ouverture de la modal pendant un drag
  const startPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const draggingRef = React.useRef(false);

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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoadingChampions(false);
      }
    }
    loadChamps();
  }, []);

  // Initialize tiers/deck when category changes
  React.useEffect(() => {
    // reset selection and tiers scaffold
    const emptyFixed = FIXED_TIERS.map(name => ({ name, items: [] as string[] }));
    if (category === 'champion-skins') {
      setTiers([...emptyFixed, { name: 'Deck', items: [] }]);
    } else {
      // fetch deck from category endpoint
      (async () => {
        try {
          setLoadingSkins(true);
          const qs = new URLSearchParams();
          if (category === 'items') {
            if (itemType) qs.set('type', itemType);
            if (itemMap) qs.set('map', itemMap);
          }
          const url = `/api/categories/${category}${qs.toString() ? `?${qs.toString()}` : ''}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Erreur chargement catégorie');
          const json: { items: Array<{ id: string; name: string; meta?: ItemMeta }> } = await res.json();
          // For items/spells/runes, id is an image URL we can use directly for deck visuals
          const deckItems = json.items.map(i => i.id);
          setSkinsMeta(json.items.map(i => ({ url: i.id, name: i.name, splash: undefined, meta: i.meta })));
          setTiers([...emptyFixed, { name: 'Deck', items: deckItems }]);
          setChampionId('');
          setSelectedSkin(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Erreur inconnue');
          setTiers([...emptyFixed, { name: 'Deck', items: [] }]);
        } finally {
          setLoadingSkins(false);
        }
      })();
    }
  }, [category, champions, itemType, itemMap]);

  // Fetch skins when champion changes (for champion-skins category)
  React.useEffect(() => {
    if (!championId) return;
    if (category !== 'champion-skins') return;
    async function loadSkins() {
      try {
        setLoadingSkins(true);
        const res = await fetch(`/api/champions/${championId}`);
        if (!res.ok) throw new Error('Erreur chargement skins');
        const champ: ApiChampionDetails = await res.json();
        const deckItems: string[] = champ.skins.map(s => s.loading);
        setSkinsMeta(champ.skins.map(s => ({ url: s.loading, name: s.name, splash: s.splash })));
        setTiers([
          ...FIXED_TIERS.map(name => ({ name, items: [] as string[] })),
          { name: 'Deck', items: deckItems }
        ]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoadingSkins(false);
      }
    }
    loadSkins();
  }, [championId, category]);

  // (rarity category removed)

  function handleReset() {
    if (category === 'champion-skins') {
      setTiers(prev => {
        const deck = prev.find(t => t.name === 'Deck');
        const deckItems = deck ? deck.items : [];
        return [
          ...FIXED_TIERS.map(name => ({ name, items: [] as string[] })),
          { name: 'Deck', items: deckItems }
        ];
      });
    } else {
      // refetch category items
      const emptyFixed = FIXED_TIERS.map(name => ({ name, items: [] as string[] }));
      (async () => {
        try {
          setLoadingSkins(true);
          const res = await fetch(`/api/categories/${category}`);
          if (!res.ok) throw new Error('Erreur chargement catégorie');
          const json: { items: Array<{ id: string; name: string }> } = await res.json();
          const deckItems = json.items.map(i => i.id);
          setTiers([...emptyFixed, { name: 'Deck', items: deckItems }]);
        } catch {
          setTiers([...emptyFixed, { name: 'Deck', items: [] }]);
        } finally {
          setLoadingSkins(false);
        }
      })();
    }
  }

  async function handleSave() {
    try {
      // reset errors
      setSubmitError(null);
      setFieldErrors({});
      setFormErrors([]);
      setSubmitting(true);
      // a few quick client checks for better UX
      if (!title.trim()) {
        setFieldErrors(prev => ({ ...prev, title: ['Le titre est requis'] }));
        setSubmitting(false);
        return;
      }
      if (tiers.length === 0) {
        setFormErrors(['Prépare au moins un tier.']);
        setSubmitting(false);
        return;
      }
      if (category === 'champion-skins' && !championId) {
        setFieldErrors(prev => ({ ...prev, championId: ['Choisis un champion pour cette catégorie'] }));
        setSubmitting(false);
        return;
      }
      const payload: {
        title: string;
        category: Category;
        championId?: string;
        tiers: Tier[];
        coverImageUrl?: string;
        coverMode?: 'manual' | 'random';
      } = { title: title.trim(), category, championId: category === 'champion-skins' ? championId : undefined, tiers };
      if (coverMode === 'manual' && coverImageUrl.trim()) {
        payload.coverImageUrl = coverImageUrl.trim();
        payload.coverMode = 'manual';
      } else {
        payload.coverMode = 'random';
      }
      const res = await fetch('/api/tierlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        router.push('/login?callbackUrl=%2Ftier-lists%2Fnew');
        return;
      }
      if (!res.ok) {
        type ZodFlatten = { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
        const errJson = await res.json().catch(() => ({} as { error?: ZodFlatten }));
        // Try to map Zod flatten error shape
        const z = errJson?.error;
        if (z && (z.fieldErrors || z.formErrors)) {
          setFieldErrors(z.fieldErrors ?? {});
          setFormErrors(Array.isArray(z.formErrors) ? z.formErrors : []);
          setSubmitting(false);
          return;
        }
        setSubmitError('Erreur lors de la sauvegarde');
        setSubmitting(false);
        return;
      }
      await res.json();
      // Redirige vers le profil après succès
      router.push('/profil');
    } catch (e) {
      console.error(e);
      setSubmitError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Créer une Tier List</h1>
            <p className="text-gray-300 text-sm">Choisis une catégorie, prépare tes tiers, puis sauvegarde.</p>
            {(submitError || formErrors.length > 0) && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-300 text-sm p-3">
                {submitError && <div className="mb-1">{submitError}</div>}
                {formErrors.map((m, i) => (
                  <div key={i}>{m}</div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                  className="bg-gray-900 text-gray-100 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  {CATEGORY_OPTIONS.map(o => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Titre</label>
                <input
                  value={title}
                  onChange={e => { setTitle(e.target.value); if (fieldErrors.title) setFieldErrors(prev => ({ ...prev, title: [] })); }}
                  aria-invalid={fieldErrors.title && fieldErrors.title.length > 0}
                  className={`bg-gray-900 text-gray-100 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${fieldErrors.title?.length ? 'border-red-500/60' : 'border-white/20'}`}
                  placeholder="Titre de la tier list"
                />
                {fieldErrors.title?.length ? (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.title[0]}</p>
                ) : null}
              </div>
              {category === 'champion-skins' && (
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
                      aria-invalid={fieldErrors.championId && fieldErrors.championId.length > 0}
                      placeholder="Rechercher..."
                      className={`w-full bg-white/10 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 placeholder:text-gray-400 ${fieldErrors.championId?.length ? 'border-red-500/60' : 'border-white/20'}`}
                    />
                    {championQuery && (
                      <button
                        type="button"
                        onClick={() => setChampionQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        aria-label="Effacer la recherche"
                      >×</button>
                    )}
                    {fieldErrors.championId?.length ? (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.championId[0]}</p>
                    ) : null}
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
                              <Image src={c.image} alt="" width={24} height={24} className="w-6 h-6 rounded object-cover" draggable={false} />
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
              )}
              {category === 'items' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Type d&apos;objet</label>
                    <select
                      value={itemType}
                      onChange={e => setItemType(e.target.value as typeof itemType)}
                      className="bg-gray-900 text-gray-100 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Tous</option>
                      <option value="final">Objets finaux</option>
                      <option value="component">Composants</option>
                      <option value="boots">Bottes</option>
                      <option value="consumable">Consommables</option>
                      <option value="trinket">Trinkets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Mode de jeu</label>
                    <select
                      value={itemMap}
                      onChange={e => setItemMap(e.target.value as typeof itemMap)}
                      className="bg-gray-900 text-gray-100 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Tous</option>
                      <option value="sr">Faille de l&apos;invocateur</option>
                      <option value="aram">ARAM</option>
                    </select>
                  </div>
                </>
              )}
              
            </div>
          </div>
          <div className="flex gap-3" aria-busy={submitting || undefined}>
            <button onClick={handleReset} disabled={submitting} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 text-sm font-medium">Réinitialiser</button>
            <button onClick={handleSave} disabled={submitting} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-medium">{submitting ? 'Sauvegarde…' : 'Sauvegarder'}</button>
            <Link href="/tier-lists" className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium">Retour</Link>
          </div>
        </header>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 overflow-x-auto min-h-[200px]">
          {/* Cover controls */}
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300">Image de couverture</label>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="cover" checked={coverMode==='random'} onChange={()=>setCoverMode('random')} />
                  Aléatoire (déterministe)
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="cover" checked={coverMode==='manual'} onChange={()=>setCoverMode('manual')} />
                  Fichier (parcourir)
                </label>
              </div>
            </div>
            {coverMode==='manual' && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setUploadingCover(true);
                        const fd = new FormData();
                        fd.append('file', f);
                        const r = await fetch('/api/tierlists/cover', { method: 'POST', body: fd });
                        const j = await r.json();
                        if (r.ok && j.url) {
                          setCoverImageUrl(j.url as string);
                        }
                      } finally {
                        setUploadingCover(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
                  >Parcourir…</button>
                  {uploadingCover && <span className="text-xs text-gray-400">Upload…</span>}
                  {coverImageUrl && <span className="text-xs text-green-400">Image sélectionnée</span>}
                </div>
              </div>
            )}
          </div>
          <div
            className="relative dnd-fix"
            // Tracking pour click vs drag (n'impacte pas la lib)
            onMouseDown={(e) => {
              const t = e.target as HTMLElement;
              if ((category === 'champion-skins' || category === 'items' || category === 'summoner-spells' || category === 'runes') && t.tagName === 'IMG') {
                startPosRef.current = { x: e.clientX, y: e.clientY };
                draggingRef.current = false;
              } else {
                startPosRef.current = null;
              }
            }}
            onMouseMove={(e) => {
              if (!startPosRef.current) return;
              const dx = Math.abs(e.clientX - startPosRef.current.x);
              const dy = Math.abs(e.clientY - startPosRef.current.y);
              if (dx > 5 || dy > 5) draggingRef.current = true;
            }}
            onMouseUp={(e) => {
              if (!startPosRef.current) return;
              const t = e.target as HTMLElement;
              const wasDragging = draggingRef.current;
              startPosRef.current = null;
              draggingRef.current = false;
              if ((category === 'champion-skins' || category === 'items' || category === 'summoner-spells' || category === 'runes') && t.tagName === 'IMG' && !wasDragging) {
                const src = (t as HTMLImageElement).src;
                const meta = skinsMeta.find(m => m.url === src || (m.url && src.endsWith(m.url.split('/').pop() || '')));
                if (meta) {
                  lastFocusRef.current = document.activeElement as HTMLElement;
                  // Lock body scroll and remember current Y
                  try {
                    scrollYRef.current = window.scrollY || window.pageYOffset || 0;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${scrollYRef.current}px`;
                    document.body.style.left = '0';
                    document.body.style.right = '0';
                    document.body.style.width = '100%';
                  } catch {}
                  setSelectedSkin(meta);
                }
              }
            }}
          >
            {loadingSkins && (
              <div className="text-sm text-gray-400">Chargement des skins...</div>
            )}
            {!loadingSkins && tiers.length > 0 && (
              <TierListMaker
                data={tiers}
                onChange={setTiers}
                config={{ rowHeight: 150, colors: ['#dc2626', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1'] }}
              />
            )}
          </div>
          {category === 'champion-skins' && !championId && !loadingChampions && (
            <div className="text-sm text-gray-500">Sélectionne un champion pour charger les skins.</div>
          )}
        </div>

  {(category === 'champion-skins' || category === 'items' || category === 'summoner-spells' || category === 'runes') && selectedSkin && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${category === 'items' ? 'Objet' : 'Skin'} ${selectedSkin.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                // Close and restore scroll
                try {
                  const y = scrollYRef.current || 0;
                  document.body.style.position = '';
                  document.body.style.top = '';
                  document.body.style.left = '';
                  document.body.style.right = '';
                  document.body.style.width = '';
                  window.scrollTo(0, y);
                } catch {}
                setSelectedSkin(null);
              }}
            />
            <div className="relative bg-gray-850 border border-gray-700 rounded-lg shadow-2xl max-w-6xl w-full overflow-hidden animate-fade-in">
              <button
                onClick={() => {
                  try {
                    const y = scrollYRef.current || 0;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.left = '';
                    document.body.style.right = '';
                    document.body.style.width = '';
                    window.scrollTo(0, y);
                  } catch {}
                  setSelectedSkin(null);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Fermer la modal"
                autoFocus
              >×</button>
              <div className="flex flex-col md:flex-row">
                {/* Media area */}
                <div className={`${category === 'champion-skins' ? 'md:flex-[1_1_60%]' : 'md:flex-1'} bg-black/40 relative min-h-[40vh] md:min-h-[60vh]`}>
                  {category === 'champion-skins' ? (
                    <>
                      <Image
                        src={selectedSkin.splash || selectedSkin.url}
                        alt={selectedSkin.name}
                        fill
                        sizes="100vw"
                        className="object-contain md:object-cover w-full h-full"
                        quality={100}
                        priority
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-gray-900/20" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <Image
                        src={selectedSkin.url}
                        alt={selectedSkin.name}
                        width={160}
                        height={160}
                        className="w-40 h-40 object-contain"
                        quality={100}
                        priority
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
                {/* Info panel */}
                <div className="md:w-[420px] p-5 space-y-4 flex flex-col">
                  {category === 'champion-skins' ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl font-semibold leading-tight break-words">
                          <span className="text-gray-300">
                            {champions.find(c => c.id === championId)?.name || ''}
                          </span>
                          <span className="text-gray-500"> — </span>
                          <span className="text-white">{selectedSkin.name}</span>
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                          Résolution: 1215×717
                        </span>
                        <a
                          href={selectedSkin.splash || selectedSkin.url}
                          target="_blank" rel="noreferrer"
                          className="text-[11px] px-2 py-1 rounded bg-blue-600/80 hover:bg-blue-500 text-white"
                        >Ouvrir l&apos;image</a>
                        <a
                          href={selectedSkin.splash || selectedSkin.url}
                          download
                          className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200"
                        >Télécharger</a>
                      </div>
                    </div>
                  ) : null}

                  {(() => {
                    const meta = selectedSkin.meta;
                    const showInfo = (category === 'items' || category === 'summoner-spells' || category === 'runes') && !!meta;
                    if (!showInfo) return null;
                    return (
                      <div className="text-sm space-y-2">
                        {category === 'items' && meta?.plaintext && (
                          <p className="text-gray-300">{meta.plaintext}</p>
                        )}
                        {category === 'items' && meta?.gold && (
                          <div className="flex gap-3 text-gray-200 flex-wrap">
                            <span className="px-2 py-1 rounded bg-white/10">Coût: {meta.gold.total}</span>
                            <span className="px-2 py-1 rounded bg-white/10">Base: {meta.gold.base}</span>
                            <span className="px-2 py-1 rounded bg-white/10">Revente: {meta.gold.sell}</span>
                          </div>
                        )}
                        {category === 'items' && (meta?.stats && Object.keys(meta.stats).length > 0) ? (
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Stats</div>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-200">
                              {Object.entries(meta!.stats!).map(([k, v]) => (
                                <li key={k} className="text-xs">{k}: <span className="text-gray-100 font-medium">{String(v)}</span></li>
                              ))}
                            </ul>
                          </div>
                        ) : (category === 'items' && meta?.statsList && meta.statsList.length > 0) ? (
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Stats</div>
                            <ul className="list-disc pl-5 space-y-1 text-gray-200">
                              {meta.statsList.map((line: string, idx: number) => (
                                <li key={idx} className="text-xs">{line}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {category === 'items' && meta?.tags && meta.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {meta.tags.map((t: string) => (
                              <span key={t} className="text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">{t}</span>
                            ))}
                          </div>
                        )}
                        {meta?.description && (
                          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: meta.description }} />
                        )}
                        {category === 'runes' && meta?.longDesc && (
                          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: meta.longDesc }} />
                        )}
                      </div>
                    );
                  })()}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => {
                        try {
                          const y = scrollYRef.current || 0;
                          document.body.style.position = '';
                          document.body.style.top = '';
                          document.body.style.left = '';
                          document.body.style.right = '';
                          document.body.style.width = '';
                          window.scrollTo(0, y);
                        } catch {}
                        setSelectedSkin(null);
                      }}
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

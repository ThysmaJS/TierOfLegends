import { cachedChampionDetails, cachedItemList, cachedSummonerSpells, cachedRunesKeystones } from '@/lib/riot';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const { searchParams } = new URL(request.url);

  try {
  if (category === 'champion-skins') {
      const championId = searchParams.get('championId');
      if (!championId) {
        return Response.json({ error: 'championId requis' }, { status: 400 });
      }
  const details = await cachedChampionDetails(championId, 'fr_FR');
      const items = details.skins.map(s => ({
        id: s.loading, // use unique image URL as item id (already in app)
        name: s.name,
        meta: { splash: s.splash, loading: s.loading },
      }));
      return Response.json({ items });
    }

    if (category === 'items') {
      const items = await cachedItemList('fr_FR');
      const type = (searchParams.get('type') || '').toLowerCase(); // '', 'final', 'component', 'boots', 'consumable', 'trinket'
      const map = (searchParams.get('map') || '').toLowerCase(); // '', 'sr', 'aram'

      const isFinal = (it: Awaited<ReturnType<typeof cachedItemList>>[number]) => !it.into || it.into.length === 0;
      const isComponent = (it: Awaited<ReturnType<typeof cachedItemList>>[number]) => Array.isArray(it.into) && it.into.length > 0;
      const hasTag = (it: Awaited<ReturnType<typeof cachedItemList>>[number], tag: string) => (it.tags || []).some(t => t.toLowerCase() === tag);
      const mapOk = (it: Awaited<ReturnType<typeof cachedItemList>>[number]) => {
        if (!map) return true;
        if (map === 'sr') return !!it.maps?.['11']; // Summoner's Rift
        if (map === 'aram') return !!it.maps?.['12']; // Howling Abyss
        return true;
      };

      let filtered = items.filter(mapOk);
      if (type === 'final') filtered = filtered.filter(isFinal);
      else if (type === 'component') filtered = filtered.filter(isComponent);
      else if (type === 'boots') filtered = filtered.filter(it => hasTag(it, 'boots'));
      else if (type === 'consumable') filtered = filtered.filter(it => hasTag(it, 'consumable'));
      else if (type === 'trinket') filtered = filtered.filter(it => hasTag(it, 'trinket'));

      const stripTags = (html: string) => html.replace(/<[^>]*>/g, '').trim();
      const splitByBreaks = (html: string) => html.split(/<br\s*\/?>(?:\s*)/gi);

      const out = filtered.map(i => {
        // Extract human-readable stats from the description's <stats>...</stats> blocks
        const statsList: string[] = [];
        if (i.description) {
          const matches = Array.from(i.description.matchAll(/<stats>([\s\S]*?)<\/stats>/gi));
          for (const m of matches) {
            const block = m[1] ?? '';
            const parts = splitByBreaks(block);
            for (const p of parts) {
              const line = stripTags(p).replace(/\s+/g, ' ').trim();
              if (line) statsList.push(line);
            }
          }
        }
        return {
          id: i.image,
          name: i.name,
          meta: {
            description: i.description,
            icon: i.image,
            id: i.id,
            gold: i.gold,
            plaintext: i.plaintext,
            stats: i.stats,
            statsList,
            tags: i.tags,
          }
        };
      });
      return Response.json({ items: out });
    }

    if (category === 'summoner-spells') {
      const spells = await cachedSummonerSpells('fr_FR');
      const out = spells.map(s => ({ id: s.image, name: s.name, meta: { description: s.description, icon: s.image } }));
      return Response.json({ items: out });
    }

    if (category === 'runes') {
      const runes = await cachedRunesKeystones('fr_FR');
      const out = runes.map(r => ({ id: r.icon, name: r.name, meta: { key: r.key, icon: r.icon, shortDesc: r.shortDesc, longDesc: r.longDesc } }));
      return Response.json({ items: out });
    }

    // no rarity category supported

  return Response.json({ error: 'Catégorie inconnue' }, { status: 400 });
  } catch {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

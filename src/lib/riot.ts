// Utilities to interact with Riot Data Dragon (static LoL data)
// Docs: https://developer.riotgames.com/docs/lol

export interface RiotChampionSummary {
  id: string; // e.g. Aatrox
  key: string; // numeric string key
  name: string;
  title: string;
  image: string; // full url to square image
  version: string;
  tags?: string[];
  partype?: string; // resource type, e.g., Mana, Energy, etc.
}

export interface RiotChampionSkin {
  id: string; // championId + skin num
  num: number;
  name: string; // "default" => will be champion base skin name
  splash: string; // splash art url
  loading: string; // loading screen url
}

export interface RiotChampionDetails extends RiotChampionSummary {
  skins: RiotChampionSkin[];
}

export interface RiotItemSummary {
  id: string; // numeric string key, use as id
  name: string;
  description: string;
  image: string; // full url to item icon
  tags: string[];
  maps: Record<string, boolean>;
  into?: string[];
  from?: string[];
  consumed?: boolean;
  inStore?: boolean;
  gold: { base: number; total: number; sell: number; purchasable: boolean };
  plaintext?: string;
  stats?: Record<string, number>;
}

export interface RiotSummonerSpell {
  id: string; // key like 'SummonerFlash'
  name: string;
  description: string;
  image: string; // full url to spell icon
}

export interface RiotRuneKeystone {
  id: number;
  key: string;
  name: string;
  icon: string; // full url to icon
  shortDesc?: string;
  longDesc?: string;
}

const CDN = 'https://ddragon.leagueoflegends.com/cdn';
const VERSIONS_ENDPOINT = 'https://ddragon.leagueoflegends.com/api/versions.json';

let cachedVersion: string | null = null;
let versionPromise: Promise<string> | null = null;

export async function getLatestVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;
  if (!versionPromise) {
    versionPromise = fetch(VERSIONS_ENDPOINT)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch versions');
        return r.json();
      })
      .then((arr: string[]) => {
        if (!Array.isArray(arr) || arr.length === 0) throw new Error('No versions received');
        cachedVersion = arr[0];
        return cachedVersion;
      })
      .finally(() => { versionPromise = null; });
  }
  return versionPromise;
}

export async function getChampionList(locale: string = 'fr_FR'): Promise<RiotChampionSummary[]> {
  const version = await getLatestVersion();
  const url = `${CDN}/${version}/data/${locale}/champion.json`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // revalidate hourly
  if (!res.ok) throw new Error('Failed to fetch champion list');
  const data: {
    data: Record<string, {
      id: string;
      key: string;
      name: string;
      title: string;
      image: { full: string };
      tags: string[];
      partype: string;
    }>;
  } = await res.json();
  return Object.values(data.data).map(c => ({
    id: c.id,
    key: c.key,
    name: c.name,
    title: c.title,
    image: `${CDN}/${version}/img/champion/${c.image.full}`,
    version,
    tags: c.tags,
    partype: c.partype,
  }));
}

export async function getChampionDetails(championId: string, locale: string = 'fr_FR'): Promise<RiotChampionDetails> {
  const version = await getLatestVersion();
  const url = `${CDN}/${version}/data/${locale}/champion/${championId}.json`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) throw new Error('Failed to fetch champion details');
  const json: {
    data: Record<string, {
      id: string;
      key: string;
      name: string;
      title: string;
      image: { full: string };
      skins: { id?: string; num: number; name: string }[];
    }>;
  } = await res.json();
  const raw = json.data[championId];
  if (!raw) throw new Error(`Champion ${championId} not found in payload`);
  const skins: RiotChampionSkin[] = raw.skins.map(s => ({
    id: `${raw.id}_${s.num}`,
    num: s.num,
    name: s.name === 'default' ? raw.name : s.name,
    splash: `${CDN}/img/champion/splash/${raw.id}_${s.num}.jpg`,
    loading: `${CDN}/img/champion/loading/${raw.id}_${s.num}.jpg`
  }));
  return {
    id: raw.id,
    key: raw.key,
    name: raw.name,
    title: raw.title,
    image: `${CDN}/${version}/img/champion/${raw.image.full}`,
    version,
    skins
  };
}

export async function getItemList(locale: string = 'fr_FR'): Promise<RiotItemSummary[]> {
  const version = await getLatestVersion();
  const url = `${CDN}/${version}/data/${locale}/item.json`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) throw new Error('Failed to fetch items');
  const data: { data: Record<string, { name: string; description: string; image: { full: string }; tags?: string[]; maps: Record<string, boolean>; into?: string[]; from?: string[]; consumed?: boolean; inStore?: boolean; gold: { base: number; total: number; sell: number; purchasable: boolean }; plaintext?: string; stats?: Record<string, number> }> } = await res.json();
  return Object.entries(data.data).map(([id, it]) => ({
    id,
    name: it.name,
    description: it.description,
    image: `${CDN}/${version}/img/item/${it.image.full}`,
    tags: it.tags ?? [],
    maps: it.maps ?? {},
    into: it.into,
    from: it.from,
    consumed: it.consumed,
    inStore: it.inStore,
    gold: it.gold,
    plaintext: it.plaintext,
    stats: it.stats,
  }));
}

export async function getSummonerSpells(locale: string = 'fr_FR'): Promise<RiotSummonerSpell[]> {
  const version = await getLatestVersion();
  const url = `${CDN}/${version}/data/${locale}/summoner.json`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) throw new Error('Failed to fetch summoner spells');
  const data: { data: Record<string, { id: string; name: string; description: string; image: { full: string } }> } = await res.json();
  return Object.values(data.data).map(sp => ({
    id: sp.id,
    name: sp.name,
    description: sp.description,
    image: `${CDN}/${version}/img/spell/${sp.image.full}`,
  }));
}

export async function getRunesKeystones(locale: string = 'fr_FR'): Promise<RiotRuneKeystone[]> {
  const version = await getLatestVersion();
  const url = `${CDN}/${version}/data/${locale}/runesReforged.json`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) throw new Error('Failed to fetch runes');
  const trees: Array<{ id: number; key: string; name: string; icons: string[]; slots: Array<{ runes: Array<{ id:number; key:string; name:string; icon:string; shortDesc?: string; longDesc?: string }> }> }> = await res.json();
  // Keystone runes are in the first slot of each tree
  const out: RiotRuneKeystone[] = [];
  for (const t of trees) {
    const first = t.slots[0];
    for (const r of first.runes) {
      out.push({ id: r.id, key: r.key, name: r.name, icon: `${CDN}/img/${r.icon.replace(/^\//, '')}`, shortDesc: r.shortDesc, longDesc: r.longDesc });
    }
  }
  return out;
}

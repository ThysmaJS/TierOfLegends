// Utilities to interact with Riot Data Dragon (static LoL data)
// Docs: https://developer.riotgames.com/docs/lol

export interface RiotChampionSummary {
  id: string; // e.g. Aatrox
  key: string; // numeric string key
  name: string;
  title: string;
  image: string; // full url to square image
  version: string;
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

export async function getChampionList(locale: string = 'en_US'): Promise<RiotChampionSummary[]> {
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
    }>;
  } = await res.json();
  return Object.values(data.data).map(c => ({
    id: c.id,
    key: c.key,
    name: c.name,
    title: c.title,
    image: `${CDN}/${version}/img/champion/${c.image.full}`,
    version
  }));
}

export async function getChampionDetails(championId: string, locale: string = 'en_US'): Promise<RiotChampionDetails> {
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

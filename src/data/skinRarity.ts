export type SkinRarity = 'Ultimate' | 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | 'Common';

// Key format: `${ChampionId}_${skinNum}` as used by Data Dragon splash/loading.
// This mapping is partial and should be extended over time.
export const SKIN_RARITY_INDEX: Record<string, SkinRarity> = {
  // Ultimate skins (examples)
  'Ezreal_7': 'Ultimate',        // Pulsefire Ezreal
  'Lux_7': 'Ultimate',           // Elementalist Lux
  'Sona_16': 'Ultimate',         // DJ Sona
  'MissFortune_10': 'Ultimate',  // Gun Goddess Miss Fortune
  'Udyr_10': 'Ultimate',         // Spirit Guard Udyr

  // Legendary (samples, extend as needed)
  'LeeSin_11': 'Legendary',
  'Zed_7': 'Legendary',
  'Katarina_9': 'Legendary',
  'Garen_12': 'Legendary',
  'Ashe_6': 'Legendary',

  // Epic (samples)
  'Ahri_14': 'Epic',
  'Ahri_10': 'Epic',
  'Jinx_12': 'Epic',
  'Caitlyn_16': 'Epic',
  'Yone_8': 'Epic',

  // Rare/Common (use conservatively; many skins are "Standard" and pricing varies by region)
  'Teemo_2': 'Rare',
  'MasterYi_2': 'Rare',
  'Ryze_1': 'Common',
};

export function getRarityKey(championId: string, skinNum: number): string {
  return `${championId}_${skinNum}`;
}
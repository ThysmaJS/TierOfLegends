export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Returns available categories and their description/options
export async function GET() {
  const categories = [
    {
      key: 'champion-skins',
      name: 'Skins d\'un champion',
      description: 'Tier list des skins d\'un champion précis (Data Dragon).',
      options: null, // requires championId via per-category endpoint
    },
    {
      key: 'items',
      name: 'Objets',
      description: 'Tier list des objets (Data Dragon item.json).',
      options: null,
    },
    {
      key: 'summoner-spells',
      name: 'Sorts d\'invocateur',
      description: 'Tier list des sorts d\'invocateur (Flash, Smite, etc.).',
      options: null,
    },
    {
      key: 'runes',
      name: 'Runes (Keystones)',
      description: 'Tier list des runes principales (Keystones) par arbre.',
      options: null,
    }
  ];
  return Response.json({ categories });
}

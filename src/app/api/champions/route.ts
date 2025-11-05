import { NextResponse } from 'next/server';
import { cachedChampionList } from '@/lib/riot';
import { logger, errorMeta } from '@/lib/logger';

// GET /api/champions -> liste des champions (id, name, image, skinsCount)
export async function GET() {
  try {
  const champs = await cachedChampionList('fr_FR');
    return NextResponse.json({ champions: champs });
  } catch (err: unknown) {
    logger.error('GET /api/champions failed', { ...errorMeta(err) });
    const message = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

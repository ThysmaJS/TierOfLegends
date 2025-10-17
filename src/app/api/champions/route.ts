import { NextResponse } from 'next/server';
import { cachedChampionList } from '@/lib/riot';

// GET /api/champions -> liste des champions (id, name, image, skinsCount)
export async function GET() {
  try {
  const champs = await cachedChampionList('fr_FR');
    return NextResponse.json({ champions: champs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

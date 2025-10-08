import { NextResponse } from 'next/server';
import { getChampionList, getChampionDetails } from '@/lib/riot';

// GET /api/champions -> liste des champions (id, name, image, skinsCount)
export async function GET() {
  try {
    const champs = await getChampionList('en_US');

    return NextResponse.json({ champions: champs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}

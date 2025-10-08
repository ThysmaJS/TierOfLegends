import { NextResponse } from 'next/server';
import { getChampionDetails } from '@/lib/riot';

// GET /api/champions/:id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const champ = await getChampionDetails(params.id, 'en_US');
    return NextResponse.json(champ);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}

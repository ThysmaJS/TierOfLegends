import { NextResponse, type NextRequest } from 'next/server';
import { getChampionDetails } from '@/lib/riot';

// GET /api/champions/:id
// Next 15 typed context.params peut être une Promise<{ id: string }>
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const champ = await getChampionDetails(id, 'en_US');
    return NextResponse.json(champ);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}

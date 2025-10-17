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
  const champ = await getChampionDetails(id, 'fr_FR');
    return NextResponse.json(champ);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

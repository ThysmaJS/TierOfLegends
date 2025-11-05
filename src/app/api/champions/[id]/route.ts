import { NextResponse, type NextRequest } from 'next/server';
import { cachedChampionDetails } from '@/lib/riot';
import { logger, errorMeta } from '@/lib/logger';

// GET /api/champions/:id
// Next 15 typed context.params peut être une Promise<{ id: string }>
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
  const champ = await cachedChampionDetails(id, 'fr_FR');
    return NextResponse.json(champ);
  } catch (err: unknown) {
    logger.error('GET /api/champions/[id] failed', { id, ...errorMeta(err) });
    const message = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

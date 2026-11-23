import { NextResponse } from 'next/server';
import { all, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ids = await all<{ ventaId: string }>('SELECT "ventaId" FROM conciliacion_ids');
    const matches = await all('SELECT * FROM conciliacion_matches');
    return NextResponse.json({
      ids: ids.map((r) => r.ventaId),
      matches,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids.map(String) : [];
    for (const id of ids) {
      await run('INSERT INTO conciliacion_ids ("ventaId") VALUES (?) ON CONFLICT ("ventaId") DO NOTHING', [id]);
    }
    if (body.match && body.match.bancoRef && body.match.ventaId) {
      await run(
        `INSERT INTO conciliacion_matches ("bancoRef", "ventaId", monto) VALUES (?, ?, ?)
         ON CONFLICT ("bancoRef") DO UPDATE SET
           "ventaId" = EXCLUDED."ventaId",
           monto = EXCLUDED.monto`,
        [String(body.match.bancoRef), String(body.match.ventaId), Number(body.match.monto || 0)]
      );
      await run(
        'INSERT INTO conciliacion_ids ("ventaId") VALUES (?) ON CONFLICT ("ventaId") DO NOTHING',
        [String(body.match.ventaId)]
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

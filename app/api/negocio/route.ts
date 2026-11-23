import { NextResponse } from 'next/server';
import { get, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const row = await get<{ nombre?: string; ruc?: string; whatsapp?: string; yape?: string }>(
      'SELECT * FROM negocio WHERE id = 1'
    );
    return NextResponse.json({
      nombre: row?.nombre || '',
      ruc: row?.ruc || '',
      whatsapp: row?.whatsapp || '',
      yape: row?.yape || '',
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await run(
      `INSERT INTO negocio (id, nombre, ruc, whatsapp, yape) VALUES (1, ?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         nombre = EXCLUDED.nombre,
         ruc = EXCLUDED.ruc,
         whatsapp = EXCLUDED.whatsapp,
         yape = EXCLUDED.yape`,
      [
        String(body.nombre || '').trim(),
        String(body.ruc || '').trim(),
        String(body.whatsapp || '').trim(),
        String(body.yape || '').trim(),
      ]
    );
    const row = await get('SELECT * FROM negocio WHERE id = 1');
    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

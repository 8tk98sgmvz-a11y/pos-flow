import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const row = db.prepare('SELECT * FROM negocio WHERE id = 1').get() as
      | { nombre?: string; ruc?: string; whatsapp?: string; yape?: string }
      | undefined;
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
    db.prepare(
      `INSERT INTO negocio (id, nombre, ruc, whatsapp, yape) VALUES (1, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET nombre = excluded.nombre, ruc = excluded.ruc, whatsapp = excluded.whatsapp, yape = excluded.yape`
    ).run(
      String(body.nombre || '').trim(),
      String(body.ruc || '').trim(),
      String(body.whatsapp || '').trim(),
      String(body.yape || '').trim()
    );
    const row = db.prepare('SELECT * FROM negocio WHERE id = 1').get();
    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

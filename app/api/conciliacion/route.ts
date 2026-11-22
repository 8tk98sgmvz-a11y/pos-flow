import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const ids = db.prepare('SELECT ventaId FROM conciliacion_ids').all() as { ventaId: string }[];
    const matches = db.prepare('SELECT * FROM conciliacion_matches').all();
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
      db.prepare('INSERT OR IGNORE INTO conciliacion_ids (ventaId) VALUES (?)').run(id);
    }
    if (body.match && body.match.bancoRef && body.match.ventaId) {
      db.prepare(
        `INSERT OR REPLACE INTO conciliacion_matches (bancoRef, ventaId, monto) VALUES (?, ?, ?)`
      ).run(String(body.match.bancoRef), String(body.match.ventaId), Number(body.match.monto || 0));
      db.prepare('INSERT OR IGNORE INTO conciliacion_ids (ventaId) VALUES (?)').run(String(body.match.ventaId));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

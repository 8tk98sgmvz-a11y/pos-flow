import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM pedidos ORDER BY createdAt DESC').all();
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `ped-${Date.now()}`;
    const createdAt = body.createdAt || new Date().toISOString();
    db.prepare(
      `INSERT INTO pedidos (id, createdAt, producto, sku, precio, estado) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      createdAt,
      String(body.producto || '').trim(),
      String(body.sku || '').trim(),
      Number(body.precio || 0),
      String(body.estado || 'PENDIENTE')
    );
    return NextResponse.json(db.prepare('SELECT * FROM pedidos WHERE id = ?').get(id));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id || '');
    if (!id) return NextResponse.json({ ok: false, error: 'Falta id' }, { status: 400 });
    const estado = String(body.estado || 'ATENDIDO');
    db.prepare(`UPDATE pedidos SET estado = ? WHERE id = ?`).run(estado, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

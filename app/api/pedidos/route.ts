import { NextResponse } from 'next/server';
import { all, get, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await all('SELECT * FROM pedidos ORDER BY "createdAt" DESC');
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
    await run(
      `INSERT INTO pedidos (id, "createdAt", producto, sku, precio, estado) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        createdAt,
        String(body.producto || '').trim(),
        String(body.sku || '').trim(),
        Number(body.precio || 0),
        String(body.estado || 'PENDIENTE'),
      ]
    );
    return NextResponse.json(await get('SELECT * FROM pedidos WHERE id = ?', [id]));
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
    await run(`UPDATE pedidos SET estado = ? WHERE id = ?`, [estado, id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

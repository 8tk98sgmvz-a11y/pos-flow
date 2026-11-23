import { NextResponse } from 'next/server';
import { all, get, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await all(
      'SELECT id, nombre, precio, costo, stock, sku, "createdAt" FROM productos ORDER BY "createdAt" DESC'
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `p-${Date.now()}`;
    const nombre = String(body.nombre || '').trim();
    const precio = Number(body.precio || 0);
    const costo = Number(body.costo || 0);
    const stock = Number(body.stock || 0);
    const sku = String(body.sku || '').trim();
    const imagen = String(body.imagen || '');
    const createdAt = body.createdAt || new Date().toISOString();

    if (!nombre) {
      return NextResponse.json({ ok: false, error: 'Nombre obligatorio' }, { status: 400 });
    }

    const existing = await get('SELECT id FROM productos WHERE id = ?', [id]);
    if (existing) {
      await run(
        `UPDATE productos SET nombre = ?, precio = ?, costo = ?, stock = ?, sku = ?, imagen = ? WHERE id = ?`,
        [nombre, precio, costo, stock, sku, imagen, id]
      );
    } else {
      await run(
        `INSERT INTO productos (id, nombre, precio, costo, stock, sku, imagen, "createdAt")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, nombre, precio, costo, stock, sku, imagen, createdAt]
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

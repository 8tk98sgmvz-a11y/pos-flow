import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = String(searchParams.get('codigo') || '').trim();
    const sku = String(searchParams.get('sku') || '').trim();
    if (codigo) {
      const row = db
        .prepare(`SELECT * FROM unidades WHERE lower(codigo) = lower(?) LIMIT 1`)
        .get(codigo);
      return NextResponse.json(row ? [row] : []);
    }
    if (sku) {
      const rows = db
        .prepare(`SELECT * FROM unidades WHERE lower(sku) = lower(?) ORDER BY createdAt DESC`)
        .all(sku);
      return NextResponse.json(rows);
    }
    const rows = db.prepare('SELECT * FROM unidades ORDER BY createdAt DESC').all();
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const codigo = String(body.codigo || '').trim();
    const sku = String(body.sku || '').trim();
    if (!codigo || !sku) {
      return NextResponse.json({ ok: false, error: 'SKU y código obligatorios' }, { status: 400 });
    }
    const dup = db
      .prepare('SELECT * FROM unidades WHERE lower(codigo) = lower(?)')
      .get(codigo) as { sku?: string; estado?: string } | undefined;
    if (dup) {
      const msg =
        dup.estado === 'VENDIDA'
          ? `Ese código ya se vendió (${dup.sku}).`
          : `Ese código ya está en tienda (${dup.sku}).`;
      return NextResponse.json({ ok: false, error: msg }, { status: 409 });
    }
    const id = body.id || `u-${Date.now()}`;
    const createdAt = body.createdAt || new Date().toISOString();
    db.prepare(
      `INSERT INTO unidades (id, sku, codigo, estado, createdAt, vendidaAt) VALUES (?, ?, ?, 'EN_TIENDA', ?, NULL)`
    ).run(id, sku, codigo, createdAt);
    const row = db.prepare('SELECT * FROM unidades WHERE id = ?').get(id);
    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const codigo = String(body.codigo || '').trim();
    if (!codigo) return NextResponse.json({ ok: false, error: 'Falta código' }, { status: 400 });
    const vendidaAt = new Date().toISOString();
    db.prepare(
      `UPDATE unidades SET estado = 'VENDIDA', vendidaAt = ? WHERE lower(codigo) = lower(?) AND estado = 'EN_TIENDA'`
    ).run(vendidaAt, codigo);
    const row = db.prepare('SELECT * FROM unidades WHERE lower(codigo) = lower(?)').get(codigo);
    return NextResponse.json(row || { ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

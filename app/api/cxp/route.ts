import { NextResponse } from 'next/server';
import db from '@/lib/db';

db.exec(`
  CREATE TABLE IF NOT EXISTS cuentas_por_pagar (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    proveedor TEXT NOT NULL,
    descripcion TEXT,
    monto REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ABIERTA',
    fechaVencimiento TEXT,
    categoria TEXT
  );
`);

export async function GET(request: Request) {
  try {
    const estado = new URL(request.url).searchParams.get('estado');
    const rows = estado
      ? db
          .prepare(`SELECT * FROM cuentas_por_pagar WHERE estado = ? ORDER BY createdAt DESC`)
          .all(estado.toUpperCase())
      : db.prepare(`SELECT * FROM cuentas_por_pagar ORDER BY createdAt DESC`).all();
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `cxp-${Date.now()}`;
    const createdAt = body.createdAt || new Date().toISOString();
    const proveedor = String(body.proveedor || '').trim() || 'Proveedor';
    const descripcion = String(body.descripcion || '');
    const monto = Number(body.monto || 0);
    const estado = String(body.estado || 'ABIERTA').toUpperCase();
    const fechaVencimiento = body.fechaVencimiento || null;
    const categoria = body.categoria || null;

    if (monto <= 0) {
      return NextResponse.json({ ok: false, error: 'Monto inválido' }, { status: 400 });
    }

    db.prepare(
      `INSERT OR REPLACE INTO cuentas_por_pagar 
       (id, createdAt, proveedor, descripcion, monto, estado, fechaVencimiento, categoria) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, createdAt, proveedor, descripcion, monto, estado, fechaVencimiento, categoria);

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id || '');
    if (!id) return NextResponse.json({ ok: false, error: 'Falta id' }, { status: 400 });

    const estado = String(body.estado || 'PAGADA').toUpperCase();
    db.prepare(`UPDATE cuentas_por_pagar SET estado = ? WHERE id = ?`).run(estado, id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
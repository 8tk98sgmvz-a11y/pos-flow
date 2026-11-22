import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Asegurar que la tabla exista (por si acaso)
db.exec(`
  CREATE TABLE IF NOT EXISTS cuentas_por_cobrar (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    cliente TEXT NOT NULL,
    descripcion TEXT,
    monto REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ABIERTA',
    ventaId TEXT,
    telefono TEXT
  );
`);

export async function GET(request: Request) {
  try {
    const estado = new URL(request.url).searchParams.get('estado');
    const rows = estado
      ? db
          .prepare(`SELECT * FROM cuentas_por_cobrar WHERE estado = ? ORDER BY createdAt DESC`)
          .all(estado.toUpperCase())
      : db.prepare(`SELECT * FROM cuentas_por_cobrar ORDER BY createdAt DESC`).all();
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `cxc-${Date.now()}`;
    const createdAt = body.createdAt || new Date().toISOString();
    const cliente = String(body.cliente || '').trim();
    const descripcion = String(body.descripcion || '');
    const monto = Number(body.monto || 0);
    const estado = String(body.estado || 'ABIERTA').toUpperCase();
    const ventaId = body.ventaId || null;
    const telefono = body.telefono || null;

    if (body.id && telefono !== null && monto <= 0 && !cliente && !descripcion) {
      db.prepare(`UPDATE cuentas_por_cobrar SET telefono = ? WHERE id = ?`).run(String(telefono), body.id);
      return NextResponse.json({ ok: true, id: body.id });
    }

    if (monto <= 0) {
      return NextResponse.json({ ok: false, error: 'Monto inválido' }, { status: 400 });
    }

    db.prepare(
      `INSERT OR REPLACE INTO cuentas_por_cobrar 
       (id, createdAt, cliente, descripcion, monto, estado, ventaId, telefono) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, createdAt, cliente || 'Cliente', descripcion, monto, estado, ventaId, telefono);

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

    if (body.telefono !== undefined) {
      db.prepare(`UPDATE cuentas_por_cobrar SET telefono = ? WHERE id = ?`).run(
        String(body.telefono || '').replace(/\D/g, ''),
        id
      );
    }
    if (body.estado) {
      const estado = String(body.estado).toUpperCase();
      db.prepare(`UPDATE cuentas_por_cobrar SET estado = ? WHERE id = ?`).run(estado, id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
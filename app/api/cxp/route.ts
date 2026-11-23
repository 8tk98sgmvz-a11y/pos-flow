import { NextResponse } from 'next/server';
import { all, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const estado = new URL(request.url).searchParams.get('estado');
    const rows = estado
      ? await all(`SELECT * FROM cuentas_por_pagar WHERE estado = ? ORDER BY "createdAt" DESC`, [
          estado.toUpperCase(),
        ])
      : await all(`SELECT * FROM cuentas_por_pagar ORDER BY "createdAt" DESC`);
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

    await run(
      `INSERT INTO cuentas_por_pagar
       (id, "createdAt", proveedor, descripcion, monto, estado, "fechaVencimiento", categoria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         "createdAt" = EXCLUDED."createdAt",
         proveedor = EXCLUDED.proveedor,
         descripcion = EXCLUDED.descripcion,
         monto = EXCLUDED.monto,
         estado = EXCLUDED.estado,
         "fechaVencimiento" = EXCLUDED."fechaVencimiento",
         categoria = EXCLUDED.categoria`,
      [id, createdAt, proveedor, descripcion, monto, estado, fechaVencimiento, categoria]
    );

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
    await run(`UPDATE cuentas_por_pagar SET estado = ? WHERE id = ?`, [estado, id]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

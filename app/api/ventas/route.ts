import { NextResponse } from 'next/server';
import { all, get, run, transaction } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await all('SELECT * FROM ventas ORDER BY "createdAt" ASC');
    return NextResponse.json(rows);
  } catch (e) {
    console.error('GET /api/ventas error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { montoTotal, costoTotal, canal, descripcion, items } = body;

    const id = String(body.id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || `v-${Date.now()}`;
    const createdAt =
      typeof body.createdAt === 'string' && !Number.isNaN(Date.parse(body.createdAt))
        ? body.createdAt
        : new Date().toISOString();
    const round = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

    await transaction(async (tx) => {
      await tx.run(
        `INSERT INTO ventas
         (id, "createdAt", "montoTotal", "costoTotal", canal, descripcion, estado, "idempotencyKey")
         VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
         ON CONFLICT (id) DO UPDATE SET
           "createdAt" = EXCLUDED."createdAt",
           "montoTotal" = EXCLUDED."montoTotal",
           "costoTotal" = EXCLUDED."costoTotal",
           canal = EXCLUDED.canal,
           descripcion = EXCLUDED.descripcion,
           estado = EXCLUDED.estado,
           "idempotencyKey" = EXCLUDED."idempotencyKey"`,
        [
          id,
          createdAt,
          round(Number(montoTotal || 0)),
          round(Number(costoTotal || 0)),
          String(canal || 'EFECTIVO'),
          String(descripcion || ''),
          `pos-${id}`,
        ]
      );

      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
          const it = items[i] as Record<string, unknown>;
          const qty = Number(it.quantity || 0);
          await tx.run(
            `INSERT INTO venta_items (id, "ventaId", "productoId", nombre, sku, quantity, precio, costo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              `${id}-i${i}`,
              id,
              String(it.productoId || ''),
              String(it.nombre || 'Producto'),
              String(it.sku || ''),
              qty,
              round(Number(it.precio || 0)),
              round(Number(it.costo || 0)),
            ]
          );
          const productoId = String(it.productoId || '');
          if (productoId && qty > 0) {
            await tx.run(`UPDATE productos SET stock = GREATEST(0, stock - ?) WHERE id = ?`, [qty, productoId]);
          }
        }
      }
    });

    const venta = await get('SELECT * FROM ventas WHERE id = ?', [id]);
    return NextResponse.json(venta);
  } catch (e) {
    console.error('POST /api/ventas error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = String(body.id || '');
    if (!id) return NextResponse.json({ ok: false, error: 'Falta id' }, { status: 400 });
    const estado = String(body.estado || 'SETTLED').toUpperCase();
    await run(`UPDATE ventas SET estado = ? WHERE id = ?`, [estado, id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

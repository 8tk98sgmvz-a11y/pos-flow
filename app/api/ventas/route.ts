import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Asegura que la tabla exista y tenga la columna
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ventas (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      montoTotal REAL NOT NULL,
      costoTotal REAL NOT NULL DEFAULT 0,
      canal TEXT NOT NULL,
      descripcion TEXT,
      estado TEXT NOT NULL DEFAULT 'PENDING',
      idempotencyKey TEXT
    );
  `);

  // Si la tabla ya existía sin la columna, la agregamos
  try {
    db.exec(`ALTER TABLE ventas ADD COLUMN idempotencyKey TEXT;`);
  } catch {
    // Ya existe la columna, no pasa nada
  }
} catch (e) {
  console.error('Error preparando tabla ventas:', e);
}

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM ventas ORDER BY createdAt ASC').all();
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

    const id = `v-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const round = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO ventas 
      (id, createdAt, montoTotal, costoTotal, canal, descripcion, estado, idempotencyKey)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `);

    const insert = db.transaction(() => {
      stmt.run(
        id,
        createdAt,
        round(Number(montoTotal || 0)),
        round(Number(costoTotal || 0)),
        String(canal || 'EFECTIVO'),
        String(descripcion || ''),
        `pos-${id}`
      );

      if (Array.isArray(items)) {
        const itemStmt = db.prepare(
          `INSERT INTO venta_items (id, ventaId, productoId, nombre, sku, quantity, precio, costo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        const stockStmt = db.prepare(
          `UPDATE productos SET stock = MAX(0, stock - ?) WHERE id = ?`
        );
        items.forEach((it: Record<string, unknown>, i: number) => {
          const qty = Number(it.quantity || 0);
          itemStmt.run(
            `${id}-i${i}`,
            id,
            String(it.productoId || ''),
            String(it.nombre || 'Producto'),
            String(it.sku || ''),
            qty,
            round(Number(it.precio || 0)),
            round(Number(it.costo || 0))
          );
          const productoId = String(it.productoId || '');
          if (productoId && qty > 0) stockStmt.run(qty, productoId);
        });
      }
    });
    insert();

    const venta = db.prepare('SELECT * FROM ventas WHERE id = ?').get(id);
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
    db.prepare(`UPDATE ventas SET estado = ? WHERE id = ?`).run(estado, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'retailos.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    costo REAL NOT NULL DEFAULT 0,
    stock REAL NOT NULL DEFAULT 0,
    sku TEXT,
    imagen TEXT,
    createdAt TEXT NOT NULL
  );
`);

export async function GET() {
  try {
    const rows = db
      .prepare('SELECT id, nombre, precio, costo, stock, sku, createdAt FROM productos ORDER BY createdAt DESC')
      .all();
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

    const existing = db.prepare('SELECT id FROM productos WHERE id = ?').get(id);
    if (existing) {
      db.prepare(
        `UPDATE productos SET nombre = ?, precio = ?, costo = ?, stock = ?, sku = ?, imagen = ? WHERE id = ?`
      ).run(nombre, precio, costo, stock, sku, imagen, id);
    } else {
      db.prepare(
        `INSERT INTO productos (id, nombre, precio, costo, stock, sku, imagen, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(id, nombre, precio, costo, stock, sku, imagen, createdAt);
    }

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
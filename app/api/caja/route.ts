import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'retailos.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS gastos (
    id TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto REAL NOT NULL,
    canal TEXT NOT NULL DEFAULT 'EFECTIVO',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ingresos (
    id TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto REAL NOT NULL,
    canal TEXT NOT NULL DEFAULT 'EFECTIVO',
    createdAt TEXT NOT NULL
  );
`);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    if (tipo === 'gastos') {
      const rows = db.prepare('SELECT * FROM gastos ORDER BY createdAt DESC').all();
      return NextResponse.json(rows);
    }
    if (tipo === 'ingresos') {
      const rows = db.prepare('SELECT * FROM ingresos ORDER BY createdAt DESC').all();
      return NextResponse.json(rows);
    }

    const gastos = (db.prepare('SELECT * FROM gastos ORDER BY createdAt DESC').all() as Array<Record<string, unknown>>).map(
      (r) => ({ ...r, tipo: 'gasto' })
    );
    const ingresos = (
      db.prepare('SELECT * FROM ingresos ORDER BY createdAt DESC').all() as Array<Record<string, unknown>>
    ).map((r) => ({ ...r, tipo: 'ingreso' }));
    const rows = [...gastos, ...ingresos].sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tipo = String(body.tipo || '').toLowerCase();
    const id = body.id || `${tipo}-${Date.now()}`;
    const descripcion = String(body.descripcion || '').trim() || (tipo === 'gasto' ? 'Gasto' : 'Ingreso');
    const monto = Number(body.monto || 0);
    const canal = String(body.canal || 'EFECTIVO').toUpperCase();
    const createdAt = body.createdAt || new Date().toISOString();

    if (monto <= 0) {
      return NextResponse.json({ ok: false, error: 'Monto inválido' }, { status: 400 });
    }

    if (tipo === 'gasto') {
      db.prepare(
        `INSERT OR REPLACE INTO gastos (id, descripcion, monto, canal, createdAt) VALUES (?, ?, ?, ?, ?)`
      ).run(id, descripcion, monto, canal, createdAt);
    } else if (tipo === 'ingreso') {
      db.prepare(
        `INSERT OR REPLACE INTO ingresos (id, descripcion, monto, canal, createdAt) VALUES (?, ?, ?, ?, ?)`
      ).run(id, descripcion, monto, canal, createdAt);
    } else {
      return NextResponse.json({ ok: false, error: 'Tipo debe ser gasto o ingreso' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
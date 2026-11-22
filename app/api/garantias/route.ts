import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM garantias ORDER BY createdAt DESC').all();
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `gti-${Date.now()}`;
    const createdAt = body.createdAt || new Date().toISOString();
    db.prepare(
      `INSERT INTO garantias (id, codigo, sku, producto, dias, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      String(body.codigo || '').trim(),
      String(body.sku || '').trim(),
      String(body.producto || '').trim(),
      Number(body.dias || 30),
      createdAt
    );
    return NextResponse.json(db.prepare('SELECT * FROM garantias WHERE id = ?').get(id));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

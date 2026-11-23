import { NextResponse } from 'next/server';
import { all, get, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await all('SELECT * FROM garantias ORDER BY "createdAt" DESC');
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
    await run(
      `INSERT INTO garantias (id, codigo, sku, producto, dias, "createdAt") VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(body.codigo || '').trim(),
        String(body.sku || '').trim(),
        String(body.producto || '').trim(),
        Number(body.dias || 30),
        createdAt,
      ]
    );
    return NextResponse.json(await get('SELECT * FROM garantias WHERE id = ?', [id]));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

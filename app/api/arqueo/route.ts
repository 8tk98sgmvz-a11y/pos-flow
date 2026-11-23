import { NextResponse } from 'next/server';
import { all, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await all('SELECT * FROM arqueos ORDER BY "createdAt" DESC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { declarado, sistema, diferencia } = body;

    const id = `arq-${Date.now()}`;
    const createdAt = new Date().toISOString();

    await run(
      `INSERT INTO arqueos (id, "createdAt", declarado, sistema, diferencia)
       VALUES (?, ?, ?, ?, ?)`,
      [id, createdAt, Number(declarado || 0), Number(sistema || 0), Number(diferencia || 0)]
    );

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { all, run } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    if (tipo === 'gastos') {
      const rows = await all('SELECT * FROM gastos ORDER BY "createdAt" DESC');
      return NextResponse.json(rows);
    }
    if (tipo === 'ingresos') {
      const rows = await all('SELECT * FROM ingresos ORDER BY "createdAt" DESC');
      return NextResponse.json(rows);
    }

    type CajaRow = Record<string, unknown> & { tipo: 'gasto' | 'ingreso'; createdAt?: string };
    const gastos = (await all('SELECT * FROM gastos ORDER BY "createdAt" DESC')).map(
      (r) => ({ ...r, tipo: 'gasto' as const })
    ) as CajaRow[];
    const ingresos = (await all('SELECT * FROM ingresos ORDER BY "createdAt" DESC')).map(
      (r) => ({ ...r, tipo: 'ingreso' as const })
    ) as CajaRow[];
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

    const upsert = `INSERT INTO %TABLE% (id, descripcion, monto, canal, "createdAt")
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        descripcion = EXCLUDED.descripcion,
        monto = EXCLUDED.monto,
        canal = EXCLUDED.canal,
        "createdAt" = EXCLUDED."createdAt"`;

    if (tipo === 'gasto') {
      await run(upsert.replace('%TABLE%', 'gastos'), [id, descripcion, monto, canal, createdAt]);
    } else if (tipo === 'ingreso') {
      await run(upsert.replace('%TABLE%', 'ingresos'), [id, descripcion, monto, canal, createdAt]);
    } else {
      return NextResponse.json({ ok: false, error: 'Tipo debe ser gasto o ingreso' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

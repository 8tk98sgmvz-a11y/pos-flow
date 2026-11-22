import { NextResponse } from 'next/server';
import { guardarEstado, leerEstado } from '@/lib/archivo';

export const dynamic = 'force-dynamic';

const CLAVES = [
  'retailos.ledger.ventas',
  'master_apple_productos',
  'retailos_cxc',
  'retailos_cxp',
  'retailos_gastos',
  'retailos_ingresos',
  'retailos_arqueos',
  'retailos_unidades',
  'retailos_garantias',
  'retailos_pedidos',
  'retailos_negocio',
  'retailos_conciliadas',
];

export async function GET() {
  try {
    return NextResponse.json(leerEstado());
  } catch (e) {
    console.error('GET /api/estado error:', e);
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      const text = await req.text();
      if (text && text.trim()) {
        body = JSON.parse(text);
      }
    } catch {
      // body vacío o JSON inválido → seguimos con objeto vacío
      body = {};
    }

    const actual = leerEstado();
    for (const k of CLAVES) {
      if (typeof body[k] === 'string') actual[k] = body[k] as string;
    }
    guardarEstado(actual);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/estado error:', e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
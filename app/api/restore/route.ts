import { NextResponse } from 'next/server';
import { restoreDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
    }

    let data: unknown;
    try {
      data = JSON.parse(await file.text());
    } catch {
      return NextResponse.json(
        { error: 'El archivo tiene que ser un backup JSON exportado desde Neon' },
        { status: 400 }
      );
    }

    await restoreDatabase(data);
    return NextResponse.json({ ok: true, message: 'Base de datos restaurada en Neon.' });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

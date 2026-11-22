import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dbPath = path.join(process.cwd(), 'retailos.db');

    fs.writeFileSync(dbPath, buffer);

    return NextResponse.json({ ok: true, message: 'Base de datos restaurada. Reinicia el servidor.' });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
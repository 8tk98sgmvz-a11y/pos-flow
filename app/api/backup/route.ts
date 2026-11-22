import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'retailos.db');

    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Base de datos no encontrada' }, { status: 404 });
    }

    const file = fs.readFileSync(dbPath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="retailos-backup.db"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
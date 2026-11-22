import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import * as XLSX from 'xlsx';

const dbPath = path.join(process.cwd(), 'retailos.db');
const db = new Database(dbPath);

export async function GET() {
  try {
    const ventas = db.prepare('SELECT * FROM ventas ORDER BY createdAt DESC').all();
    const arqueos = db.prepare('SELECT * FROM arqueos ORDER BY createdAt DESC').all();

    const wb = XLSX.utils.book_new();

    if (ventas.length > 0) {
      const wsVentas = XLSX.utils.json_to_sheet(ventas);
      XLSX.utils.book_append_sheet(wb, wsVentas, 'Ventas');
    }

    if (arqueos.length > 0) {
      const wsArqueos = XLSX.utils.json_to_sheet(arqueos);
      XLSX.utils.book_append_sheet(wb, wsArqueos, 'Arqueos');
    }

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="retailos-export.xlsx"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
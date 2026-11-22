import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const fromItems = db
      .prepare(
        `SELECT
           nombre as producto,
           SUM(quantity) as unidades,
           SUM(precio * quantity) as total,
           SUM(costo * quantity) as costo,
           SUM((precio - costo) * quantity) as margen
         FROM venta_items
         GROUP BY nombre
         ORDER BY total DESC`
      )
      .all() as Array<{ unidades: number; total: number; costo: number; margen: number }>;

    if (fromItems.length > 0) {
      return NextResponse.json(
        fromItems.map((r) => ({
          ...r,
          unidades: Number(r.unidades || 0),
          total: Number(r.total || 0),
          costo: Number(r.costo || 0),
          margen: Number(r.margen || 0),
        }))
      );
    }

    const rows = db
      .prepare(
        `SELECT
           descripcion as producto,
           1 as unidades,
           SUM(montoTotal) as total,
           SUM(COALESCE(costoTotal, 0)) as costo,
           SUM(montoTotal - COALESCE(costoTotal, 0)) as margen
         FROM ventas
         WHERE descripcion IS NOT NULL AND descripcion != '' AND upper(canal) != 'FIADO'
         GROUP BY descripcion
         ORDER BY total DESC`
      )
      .all();

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

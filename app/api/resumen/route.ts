import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isolate } from '@/lib/isolate';

function n(row: unknown) {
  return Number((row as { n?: number } | undefined)?.n || 0);
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const day = new Date().toISOString().slice(0, 10);

  const efectivo = isolate(0, () =>
    n(
      db
        .prepare(
          `SELECT COALESCE(SUM(montoTotal), 0) AS n FROM ventas
           WHERE substr(createdAt, 1, 10) = ? AND upper(canal) = 'EFECTIVO'`
        )
        .get(day)
    )
  );
  const digitalHoy = isolate(0, () =>
    n(
      db
        .prepare(
          `SELECT COALESCE(SUM(montoTotal), 0) AS n FROM ventas
           WHERE substr(createdAt, 1, 10) = ? AND upper(canal) IN ('YAPE', 'TARJETA')`
        )
        .get(day)
    )
  );
  const ingresos = isolate(0, () =>
    n(db.prepare(`SELECT COALESCE(SUM(monto), 0) AS n FROM ingresos WHERE substr(createdAt, 1, 10) = ?`).get(day))
  );
  const gastos = isolate(0, () =>
    n(db.prepare(`SELECT COALESCE(SUM(monto), 0) AS n FROM gastos WHERE substr(createdAt, 1, 10) = ?`).get(day))
  );
  const gastosEfectivo = isolate(0, () =>
    n(
      db
        .prepare(
          `SELECT COALESCE(SUM(monto), 0) AS n FROM gastos
           WHERE substr(createdAt, 1, 10) = ? AND upper(COALESCE(canal, 'EFECTIVO')) = 'EFECTIVO'`
        )
        .get(day)
    )
  );

  const cxc = isolate({ total: 0, n: 0 }, () =>
    db
      .prepare(
        `SELECT COALESCE(SUM(monto), 0) AS total, COUNT(*) AS n
         FROM cuentas_por_cobrar WHERE estado = 'ABIERTA'`
      )
      .get()
  ) as { total: number; n: number };

  const cxp = isolate({ total: 0, n: 0 }, () =>
    db
      .prepare(
        `SELECT COALESCE(SUM(monto), 0) AS total, COUNT(*) AS n
         FROM cuentas_por_pagar WHERE estado = 'ABIERTA'`
      )
      .get()
  ) as { total: number; n: number };

  const ventasHoy = isolate(0, () =>
    n(db.prepare(`SELECT COUNT(*) AS n FROM ventas WHERE substr(createdAt, 1, 10) = ?`).get(day))
  );
  const arqueoHoy = isolate(null, () => {
    const row = db
      .prepare(
        `SELECT declarado, diferencia, createdAt FROM arqueos
         WHERE substr(createdAt, 1, 10) = ? ORDER BY createdAt DESC LIMIT 1`
      )
      .get(day) as { declarado: number; diferencia: number } | undefined;
    return row
      ? { declarado: Number(row.declarado || 0), diferencia: Number(row.diferencia || 0) }
      : null;
  });

  return NextResponse.json({
    cajon: Number((efectivo + ingresos - gastos).toFixed(2)),
    digitalHoy: Number(digitalHoy.toFixed(2)),
    sistema: Number((efectivo + ingresos - gastosEfectivo).toFixed(2)),
    ventasHoy,
    arqueoHoy,
    cxcTotal: Number(Number(cxc.total || 0).toFixed(2)),
    cxcN: Number(cxc.n || 0),
    cxpTotal: Number(Number(cxp.total || 0).toFixed(2)),
    cxpN: Number(cxp.n || 0),
  });
}

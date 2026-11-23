import { NextResponse } from 'next/server';
import { get } from '@/lib/db';
import { isolateAsync } from '@/lib/isolate';

function n(row: unknown) {
  return Number((row as { n?: number } | undefined)?.n || 0);
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const day = new Date().toISOString().slice(0, 10);

  const efectivo = await isolateAsync(0, async () =>
    n(
      await get(
        `SELECT COALESCE(SUM("montoTotal"), 0) AS n FROM ventas
         WHERE substr("createdAt", 1, 10) = ? AND upper(canal) = 'EFECTIVO'`,
        [day]
      )
    )
  );
  const digitalHoy = await isolateAsync(0, async () =>
    n(
      await get(
        `SELECT COALESCE(SUM("montoTotal"), 0) AS n FROM ventas
         WHERE substr("createdAt", 1, 10) = ? AND upper(canal) IN ('YAPE', 'TARJETA')`,
        [day]
      )
    )
  );
  const ingresos = await isolateAsync(0, async () =>
    n(
      await get(`SELECT COALESCE(SUM(monto), 0) AS n FROM ingresos WHERE substr("createdAt", 1, 10) = ?`, [day])
    )
  );
  const gastos = await isolateAsync(0, async () =>
    n(await get(`SELECT COALESCE(SUM(monto), 0) AS n FROM gastos WHERE substr("createdAt", 1, 10) = ?`, [day]))
  );
  const gastosEfectivo = await isolateAsync(0, async () =>
    n(
      await get(
        `SELECT COALESCE(SUM(monto), 0) AS n FROM gastos
         WHERE substr("createdAt", 1, 10) = ? AND upper(COALESCE(canal, 'EFECTIVO')) = 'EFECTIVO'`,
        [day]
      )
    )
  );

  const cxc = await isolateAsync({ total: 0, n: 0 }, async () => {
    const row = await get<{ total?: number | string; n?: number | string }>(
      `SELECT COALESCE(SUM(monto), 0) AS total, COUNT(*) AS n
       FROM cuentas_por_cobrar WHERE estado = 'ABIERTA'`
    );
    return { total: Number(row?.total || 0), n: Number(row?.n || 0) };
  });

  const cxp = await isolateAsync({ total: 0, n: 0 }, async () => {
    const row = await get<{ total?: number | string; n?: number | string }>(
      `SELECT COALESCE(SUM(monto), 0) AS total, COUNT(*) AS n
       FROM cuentas_por_pagar WHERE estado = 'ABIERTA'`
    );
    return { total: Number(row?.total || 0), n: Number(row?.n || 0) };
  });

  const ventasHoy = await isolateAsync(0, async () =>
    n(await get(`SELECT COUNT(*) AS n FROM ventas WHERE substr("createdAt", 1, 10) = ?`, [day]))
  );
  const arqueoHoy = await isolateAsync(null, async () => {
    const row = await get<{ declarado?: number; diferencia?: number }>(
      `SELECT declarado, diferencia, "createdAt" FROM arqueos
       WHERE substr("createdAt", 1, 10) = ? ORDER BY "createdAt" DESC LIMIT 1`,
      [day]
    );
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

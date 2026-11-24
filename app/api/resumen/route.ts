import { NextResponse } from 'next/server';
import { get } from '@/lib/db';
import { isolateAsync } from '@/lib/isolate';
import { diaNegocio, money } from '@/lib/money';

export const dynamic = 'force-dynamic';

const LIMA = `CASE
  WHEN "createdAt" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'
  THEN to_char(("createdAt")::timestamptz AT TIME ZONE 'America/Lima', 'YYYY-MM-DD')
  ELSE NULL
END`;

type Fila = {
  efectivo?: number | string;
  digital?: number | string;
  cobradas?: number | string;
  fiados_n?: number | string;
  ingresos?: number | string;
  gastos_efectivo?: number | string;
  cxc_total?: number | string;
  cxc_n?: number | string;
  cxp_total?: number | string;
  cxp_n?: number | string;
  arqueo_declarado?: number | string | null;
  arqueo_diferencia?: number | string | null;
};

export async function GET() {
  const day = diaNegocio();
  const row = await isolateAsync(null, () =>
    get<Fila>(
      `SELECT
         (SELECT COALESCE(SUM("montoTotal") FILTER (
            WHERE upper(COALESCE(canal, 'EFECTIVO')) NOT IN ('YAPE', 'TARJETA', 'PLIN', 'FIADO')
          ), 0)
          FROM ventas WHERE ${LIMA} = ?) AS efectivo,
         (SELECT COALESCE(SUM("montoTotal") FILTER (
            WHERE upper(canal) IN ('YAPE', 'TARJETA', 'PLIN')
          ), 0)
          FROM ventas WHERE ${LIMA} = ?) AS digital,
         (SELECT COUNT(*) FILTER (WHERE upper(COALESCE(canal, '')) <> 'FIADO')
          FROM ventas WHERE ${LIMA} = ?) AS cobradas,
         (SELECT COUNT(*) FILTER (WHERE upper(canal) = 'FIADO')
          FROM ventas WHERE ${LIMA} = ?) AS fiados_n,
         (SELECT COALESCE(SUM(monto), 0) FROM ingresos WHERE ${LIMA} = ?) AS ingresos,
         (SELECT COALESCE(SUM(monto), 0) FROM gastos
          WHERE ${LIMA} = ? AND upper(COALESCE(canal, 'EFECTIVO')) = 'EFECTIVO') AS gastos_efectivo,
         (SELECT COALESCE(SUM(monto), 0) FROM cuentas_por_cobrar WHERE estado = 'ABIERTA') AS cxc_total,
         (SELECT COUNT(*) FROM cuentas_por_cobrar WHERE estado = 'ABIERTA') AS cxc_n,
         (SELECT COALESCE(SUM(monto), 0) FROM cuentas_por_pagar WHERE estado = 'ABIERTA') AS cxp_total,
         (SELECT COUNT(*) FROM cuentas_por_pagar WHERE estado = 'ABIERTA') AS cxp_n,
         (SELECT declarado FROM arqueos WHERE ${LIMA} = ? ORDER BY "createdAt" DESC LIMIT 1) AS arqueo_declarado,
         (SELECT diferencia FROM arqueos WHERE ${LIMA} = ? ORDER BY "createdAt" DESC LIMIT 1) AS arqueo_diferencia`,
      [day, day, day, day, day, day, day, day]
    )
  );

  const efectivo = Number(row?.efectivo || 0);
  const ingresos = Number(row?.ingresos || 0);
  const gastosEfectivo = Number(row?.gastos_efectivo || 0);
  const cajon = money(efectivo + ingresos - gastosEfectivo);
  const arqueoHoy =
    row && row.arqueo_declarado != null
      ? {
          declarado: Number(row.arqueo_declarado || 0),
          diferencia: Number(row.arqueo_diferencia || 0),
        }
      : null;

  return NextResponse.json({
    cajon,
    digitalHoy: money(Number(row?.digital || 0)),
    sistema: cajon,
    ventasHoy: Number(row?.cobradas || 0),
    fiadosHoy: Number(row?.fiados_n || 0),
    arqueoHoy,
    cxcTotal: money(Number(row?.cxc_total || 0)),
    cxcN: Number(row?.cxc_n || 0),
    cxpTotal: money(Number(row?.cxp_total || 0)),
    cxpN: Number(row?.cxp_n || 0),
  });
}

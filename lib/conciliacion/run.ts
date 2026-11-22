import { parseBankCsv } from './parseCsv';
import { conciliarMovimientos } from './match';
import { listarVentasPendientes } from '@/lib/ledger';
import { idsConciliadas } from './conciliadas';
import type { VentaPendiente } from './types';

const SAMPLE_CSV = `fecha,descripcion,monto,referencia
17/09/2026 10:12,TRANSF JUAN PEREZ,1250.00,OP-1001
17/09/2026 10:14,COMISION MANTENIMIENTO,-340.50,OP-1002
17/09/2026 10:18,YAPE MARIA LOPEZ,890.00,OP-1003
17/09/2026 11:07,YAPE POS TEPHH,66.08,OP-1004`;

export async function runConciliacion(csvTexto?: string) {
  const raw = csvTexto && csvTexto.trim() ? csvTexto : SAMPLE_CSV;
  const bancos = parseBankCsv(raw);
  const yaListas = new Set(await idsConciliadas());

  const ventasRaw = await listarVentasPendientes();
  const ventas = Array.isArray(ventasRaw) ? ventasRaw : [];

  const delLedger: VentaPendiente[] = ventas
    .filter((v) => !yaListas.has(String(v.id)))
    .map((v) => ({
      id: v.id,
      montoTotal: Number(v.montoTotal),
      fechaCreacion: new Date(v.createdAt),
      canal: v.canal,
      idempotencyKey: v.idempotencyKey,
      estado: 'PENDIENTE',
    }));

  console.log('LEDGER PENDIENTES', delLedger.length, delLedger);
  console.log('BANCO LINEAS', bancos.length);

  const informe = conciliarMovimientos(bancos, delLedger);

  console.log('INFORME', {
    matches: informe.matches.length,
    unidentified: informe.resumen.unidentified,
    huerfanas: informe.resumen.ventasHuérfanas,
    ventasSinBanco: informe.ventasSinBanco?.length ?? 0,
  });

  return informe;
}
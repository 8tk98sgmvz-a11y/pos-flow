import type {
  TransaccionBanco,
  VentaPendiente,
  ResultadoMatch,
  InformeConciliacion,
} from './types';
  import { toCents } from './money';
  
  const WINDOW_MS = 5 * 60 * 1000;
  
  function mismaPlata(a: number, b: number) {
    return toCents(a) === toCents(b);
  }
  
  export function conciliarMovimientos(
    bancos: TransaccionBanco[],
    ventas: VentaPendiente[]
  ): InformeConciliacion {
    const usadas = new Set<string>();
    const matches: ResultadoMatch[] = [];
  
    const ordenadas = [...ventas].sort(
      (a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime()
    );
  
    for (const banco of bancos) {
      if (banco.monto <= 0) {
        matches.push({
          banco,
          venta: null,
          estado: 'UNIDENTIFIED',
          motivo: 'Egreso / comisión',
        });
        continue;
      }
  
      const candidatas = ordenadas.filter((v) => {
        if (usadas.has(v.id)) return false;
        if (!mismaPlata(v.montoTotal, banco.monto)) return false;
        const dt = Math.abs(v.fechaCreacion.getTime() - banco.fecha.getTime());
        return dt <= WINDOW_MS;
      });
  
      if (candidatas.length === 0) {
        matches.push({
          banco,
          venta: null,
          estado: 'UNIDENTIFIED',
          motivo: 'Sin venta equivalente',
        });
        continue;
      }
  
      const venta = candidatas[0];
      usadas.add(venta.id);
  
      const dt = Math.abs(venta.fechaCreacion.getTime() - banco.fecha.getTime());
      matches.push({
        banco,
        venta,
        estado: dt <= 60_000 ? 'MATCHED' : 'MATCHED_WITH_WARNING',
        motivo: dt <= 60_000 ? 'Monto y ventana exactos' : 'Monto igual, hora fuera de 1 min',
      });
    }
  
    const ventasSinBanco = ordenadas.filter((v) => !usadas.has(v.id));
    const unidentified = matches.filter((m) => m.estado === 'UNIDENTIFIED').length;
  
    return {
      matches,
      ventasSinBanco,
      dineroSinIdentificar: matches
        .filter((m) => m.estado === 'UNIDENTIFIED')
        .map((m) => m.banco),
      advertencias: matches.filter((m) => m.estado === 'MATCHED_WITH_WARNING'),
      resumen: {
        bancos: bancos.length,
        ventasPendientes: ventas.length,
        matched: matches.filter((m) => m.estado === 'MATCHED').length,
        matchedConAdvertencia: matches.filter((m) => m.estado === 'MATCHED_WITH_WARNING').length,
        unidentified,
        ventasHuérfanas: ventasSinBanco.length,
      },
    };
  }
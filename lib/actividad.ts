import { listarVentas } from '@/lib/ledger';

export type PuntoHora = { hora: string; total: number };

export async function ventasPorHoraHoy(): Promise<PuntoHora[]> {
  const hoy = new Date().toISOString().slice(0, 10);
  const buckets = Array.from({ length: 12 }, (_, i) => {
    const h = i * 2;
    return {
      hora: String(h).padStart(2, '0') + '–' + String(h + 1).padStart(2, '0'),
      total: 0,
    };
  });

  const ventasRaw = await listarVentas();
  const ventas = Array.isArray(ventasRaw) ? ventasRaw : [];

  for (const v of ventas) {
    const iso = String(v.createdAt || '');
    if (!iso.startsWith(hoy)) continue;
    if (String(v.canal || '').toUpperCase() === 'FIADO') continue;
    const h = new Date(iso).getHours();
    if (h >= 0 && h < 24) {
      buckets[Math.floor(h / 2)].total += Number(v.montoTotal || 0);
    }
  }

  return buckets;
}

export function maximo(puntos: any): number {
  if (!Array.isArray(puntos)) return 1;
  return Math.max(1, ...puntos.map((p: any) => Number(p?.total) || 0));
}
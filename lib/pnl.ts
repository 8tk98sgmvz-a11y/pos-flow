import { money, pct } from '@/lib/money';

export type ResumenPnl = {
  ventas: number;
  costo: number;
  utilidadBruta: number;
  gastos: number;
  utilidadNeta: number;
  margen: number;
};

async function fetchArr<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function resumenPnl(): Promise<ResumenPnl> {
  const [ventas, caja] = await Promise.all([
    fetchArr<{ montoTotal?: number; costoTotal?: number; canal?: string }>('/api/ventas'),
    fetchArr<{ monto?: number; tipo?: string }>('/api/caja'),
  ]);

  const cobradas = ventas.filter((v) => String(v.canal || '').toUpperCase() !== 'FIADO');
  const ventasT = money(cobradas.reduce((a, v) => a + Number(v.montoTotal || 0), 0));
  const costo = money(cobradas.reduce((a, v) => a + Number(v.costoTotal || 0), 0));
  const gastos = money(
    caja.filter((x) => x.tipo === 'gasto' || !x.tipo).reduce((a, g) => a + Number(g.monto || 0), 0)
  );
  const utilidadBruta = money(ventasT - costo);
  const utilidadNeta = money(utilidadBruta - gastos);
  return {
    ventas: ventasT,
    costo,
    utilidadBruta,
    gastos,
    utilidadNeta,
    margen: pct(utilidadBruta, ventasT),
  };
}

export function soles(n: number) {
  return `S/ ${Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

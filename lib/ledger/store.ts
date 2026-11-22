import { apiSend } from '@/lib/live';
import type { CanalPago, VentaPOS } from './types';

const API = '/api/ventas';

async function apiGet(): Promise<VentaPOS[]> {
  try {
    const res = await fetch(API, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listarVentas(): Promise<VentaPOS[]> {
  const fromApi = await apiGet();
  return fromApi.sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
}

export async function listarVentasPendientes(): Promise<VentaPOS[]> {
  const all = await listarVentas();
  return all.filter((v) => v.estado === 'PENDING');
}

export async function registrarVentaPOS(input: {
  montoTotal: number;
  costoTotal?: number;
  canal: CanalPago;
  descripcion: string;
}): Promise<VentaPOS> {
  const res = await apiSend(API, 'POST', input);
  if (!res.ok) {
    throw new Error('No se pudo guardar la venta');
  }
  return (await res.json()) as VentaPOS;
}

export async function marcarVentaSettled(id: string): Promise<void> {
  await apiSend(API, 'PATCH', { id, estado: 'SETTLED' });
}

export async function ventasPorCanalHoy(canal: CanalPago): Promise<number> {
  const hoy = new Date().toISOString().slice(0, 10);
  const all = await listarVentas();
  return all
    .filter((v) => String(v.createdAt || '').startsWith(hoy) && v.canal === canal)
    .reduce((acc, v) => acc + Number(v.montoTotal || 0), 0);
}

export async function efectivoEnCajonHoy(): Promise<number> {
  return ventasPorCanalHoy('EFECTIVO');
}

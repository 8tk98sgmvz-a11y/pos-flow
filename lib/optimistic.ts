import { pingLive } from '@/lib/live';
import { money } from '@/lib/money';

const KEY = 'retailos_pending_sales';

export type VentaPendiente = {
  id: string;
  createdAt: string;
  montoTotal: number;
  canal: string;
  descripcion: string;
};

export function leerPendientes(): VentaPendiente[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function guardar(rows: VentaPendiente[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
  pingLive();
}

export function anotarPendiente(venta: VentaPendiente) {
  const row = { ...venta, montoTotal: money(venta.montoTotal) };
  guardar(leerPendientes().filter((p) => p.id !== row.id).concat(row));
}

export function quitarPendiente(id: string) {
  guardar(leerPendientes().filter((p) => p.id !== id));
}

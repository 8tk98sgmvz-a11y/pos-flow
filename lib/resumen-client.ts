import { onLive } from '@/lib/live';
import { diaNegocio, esDigital, esFiado, money } from '@/lib/money';

export type Resumen = {
  cajon: number;
  digitalHoy: number;
  ventasHoy: number;
  fiadosHoy: number;
  arqueoHoy: { declarado: number; diferencia: number } | null;
  cxcTotal: number;
  cxcN: number;
  cxpTotal: number;
  cxpN: number;
};

export type VentaLigera = {
  id: string;
  createdAt: string;
  montoTotal: number;
  canal: string;
};

export const emptyResumen: Resumen = {
  cajon: 0,
  digitalHoy: 0,
  ventasHoy: 0,
  fiadosHoy: 0,
  arqueoHoy: null,
  cxcTotal: 0,
  cxcN: 0,
  cxpTotal: 0,
  cxpN: 0,
};

/** Suma ventas aún no confirmadas por el servidor. No se persiste dentro del caché. */
export function aplicarPendientes(base: Resumen, pendientes: VentaLigera[]): Resumen {
  const hoy = diaNegocio();
  const next = { ...base };
  for (const p of pendientes) {
    if (diaNegocio(p.createdAt) !== hoy) continue;
    const monto = money(p.montoTotal);
    if (esFiado(p.canal)) {
      next.fiadosHoy += 1;
      next.cxcTotal = money(next.cxcTotal + monto);
      next.cxcN += 1;
      continue;
    }
    next.ventasHoy += 1;
    if (esDigital(p.canal)) next.digitalHoy = money(next.digitalHoy + monto);
    else next.cajon = money(next.cajon + monto);
  }
  return next;
}

const CACHE = 'retailos_resumen';

export function readResumenCache(): Resumen {
  try {
    const raw = sessionStorage.getItem(CACHE);
    if (raw) return { ...emptyResumen, ...(JSON.parse(raw) as Partial<Resumen>) };
  } catch {
    /* ignore */
  }
  return emptyResumen;
}

export function writeResumenCache(data: Resumen) {
  try {
    sessionStorage.setItem(CACHE, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export async function fetchResumen(): Promise<Resumen | null> {
  try {
    const res = await fetch('/api/resumen', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.error && json.cajon == null) return null;
    return {
      cajon: Number(json.cajon || 0),
      digitalHoy: Number(json.digitalHoy || 0),
      ventasHoy: Number(json.ventasHoy || 0),
      fiadosHoy: Number(json.fiadosHoy || 0),
      arqueoHoy: json.arqueoHoy
        ? {
            declarado: Number(json.arqueoHoy.declarado || 0),
            diferencia: Number(json.arqueoHoy.diferencia || 0),
          }
        : null,
      cxcTotal: Number(json.cxcTotal || 0),
      cxcN: Number(json.cxcN || 0),
      cxpTotal: Number(json.cxpTotal || 0),
      cxpN: Number(json.cxpN || 0),
    };
  } catch {
    return null;
  }
}

/** Pinta el caché al instante. Una venta pendiente se suma antes de que responda el servidor. */
export function suscribirResumen(cb: (data: Resumen) => void, pendientes: () => VentaLigera[]) {
  let seq = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const paint = () => cb(aplicarPendientes(readResumenCache(), pendientes()));
  const pull = async () => {
    const id = ++seq;
    const server = await fetchResumen();
    if (id !== seq || !server) return;
    writeResumenCache(server);
    cb(aplicarPendientes(server, pendientes()));
  };
  const schedule = () => {
    if (pendientes().length) paint();
    clearTimeout(timer);
    timer = setTimeout(() => void pull(), 80);
  };
  paint();
  void pull();
  const stop = onLive(schedule);
  return () => {
    clearTimeout(timer);
    stop();
  };
}

export type Resumen = {
  cajon: number;
  digitalHoy: number;
  ventasHoy: number;
  arqueoHoy: { declarado: number; diferencia: number } | null;
  cxcTotal: number;
  cxcN: number;
  cxpTotal: number;
  cxpN: number;
};

export const emptyResumen: Resumen = {
  cajon: 0,
  digitalHoy: 0,
  ventasHoy: 0,
  arqueoHoy: null,
  cxcTotal: 0,
  cxcN: 0,
  cxpTotal: 0,
  cxpN: 0,
};

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

import { apiSend } from '@/lib/live';

export type MatchManual = {
  bancoRef: string;
  ventaId: string;
  monto: number;
};

async function load() {
  try {
    const res = await fetch('/api/conciliacion', { cache: 'no-store' });
    if (!res.ok) return { ids: [] as string[], matches: [] as MatchManual[] };
    const data = await res.json();
    return {
      ids: Array.isArray(data.ids) ? data.ids.map(String) : [],
      matches: Array.isArray(data.matches) ? data.matches : [],
    };
  } catch {
    return { ids: [] as string[], matches: [] as MatchManual[] };
  }
}

export async function idsConciliadas(): Promise<string[]> {
  const data = await load();
  return data.ids;
}

export async function marcarVentasConciliadas(ids: string[]) {
  if (!ids.length) return;
  await apiSend('/api/conciliacion', 'POST', { ids });
}

export async function listarMatchesManuales(): Promise<MatchManual[]> {
  const data = await load();
  return data.matches;
}

export async function guardarMatchManual(m: MatchManual) {
  await apiSend('/api/conciliacion', 'POST', { match: m, ids: [m.ventaId] });
}

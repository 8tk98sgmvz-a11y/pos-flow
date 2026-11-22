export type CuentaPorPagar = {
  id: string;
  createdAt: string;
  proveedor: string;
  descripcion: string;
  monto: number;
  estado: 'ABIERTA' | 'PAGADA';
};

async function apiList(): Promise<CuentaPorPagar[]> {
  try {
    const res = await fetch('/api/cxp', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listarCxp(): Promise<CuentaPorPagar[]> {
  const rows = await apiList();
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function listarCxpAbiertas(): Promise<CuentaPorPagar[]> {
  const rows = await listarCxp();
  return rows.filter((c) => c.estado === 'ABIERTA');
}

export async function registrarPorPagar(input: {
  proveedor: string;
  descripcion: string;
  monto: number;
}): Promise<CuentaPorPagar> {
  const row: CuentaPorPagar = {
    id: `cxp-${Date.now()}`,
    createdAt: new Date().toISOString(),
    proveedor: String(input.proveedor || '').trim() || 'Proveedor',
    descripcion: input.descripcion,
    monto: Number(input.monto || 0),
    estado: 'ABIERTA',
  };

  const { apiSend } = await import('@/lib/live');
  await apiSend('/api/cxp', 'POST', row);

  return row;
}

export async function totalCxpAbiertas(): Promise<number> {
  const rows = await listarCxpAbiertas();
  return rows.reduce((acc, c) => acc + Number(c.monto || 0), 0);
}

export async function marcarCxpPagada(id: string): Promise<CuentaPorPagar | null> {
  const { apiSend } = await import('@/lib/live');
  await apiSend('/api/cxp', 'PATCH', { id, estado: 'PAGADA' });
  const rows = await listarCxp();
  return rows.find((c) => c.id === id) || null;
}

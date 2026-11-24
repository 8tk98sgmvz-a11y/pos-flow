export type CuentaPorCobrar = {
  id: string;
  createdAt: string;
  cliente: string;
  telefono?: string;
  descripcion: string;
  monto: number;
  estado: 'ABIERTA' | 'PAGADA';
  ventaId?: string;
};

async function apiList(): Promise<CuentaPorCobrar[]> {
  try {
    const res = await fetch('/api/cxc', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listarCxc(): Promise<CuentaPorCobrar[]> {
  const rows = await apiList();
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function listarCxcAbiertas(): Promise<CuentaPorCobrar[]> {
  const rows = await listarCxc();
  return rows.filter((c) => c.estado === 'ABIERTA');
}

export async function registrarFiado(input: {
  cliente: string;
  descripcion: string;
  monto: number;
  ventaId?: string;
  telefono?: string;
}): Promise<CuentaPorCobrar> {
  const row: CuentaPorCobrar = {
    id: `cxc-${Date.now()}`,
    createdAt: new Date().toISOString(),
    cliente: String(input.cliente || '').trim() || 'Cliente',
    telefono: (input.telefono || '').replace(/\D/g, ''),
    descripcion: input.descripcion,
    monto: Number(input.monto || 0),
    estado: 'ABIERTA',
    ventaId: input.ventaId,
  };

  const { apiSend } = await import('@/lib/live');
  const res = await apiSend('/api/cxc', 'POST', row);
  if (!res.ok) throw new Error('No se anotó el fiado');

  return row;
}

export async function guardarTelefonoCxc(id: string, telefono: string): Promise<void> {
  const tel = telefono.replace(/\D/g, '');
  const { apiSend } = await import('@/lib/live');
  await apiSend('/api/cxc', 'POST', { id, telefono: tel });
}

export async function totalCxcAbiertas(): Promise<number> {
  const rows = await listarCxcAbiertas();
  return rows.reduce((acc, c) => acc + Number(c.monto || 0), 0);
}

export async function marcarCxcPagada(id: string): Promise<CuentaPorCobrar | null> {
  const { apiSend } = await import('@/lib/live');
  await apiSend('/api/cxc', 'PATCH', { id, estado: 'PAGADA' });
  const rows = await listarCxc();
  return rows.find((c) => c.id === id) || null;
}

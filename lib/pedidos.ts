import { apiSend } from '@/lib/live';

export type Pedido = {
  id: string;
  createdAt: string;
  producto: string;
  sku: string;
  precio: number;
  estado: 'PENDIENTE' | 'ATENDIDO' | 'CANCELADO';
};

async function apiList(): Promise<Pedido[]> {
  try {
    const res = await fetch('/api/pedidos', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listarPedidos(): Promise<Pedido[]> {
  const rows = await apiList();
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function listarPedidosPendientes(): Promise<Pedido[]> {
  const rows = await listarPedidos();
  return rows.filter((p) => p.estado === 'PENDIENTE');
}

export async function registrarPedido(input: {
  producto: string;
  sku: string;
  precio: number;
}): Promise<Pedido> {
  const row: Pedido = {
    id: `ped-${Date.now()}`,
    createdAt: new Date().toISOString(),
    producto: String(input.producto || '').trim(),
    sku: String(input.sku || '').trim(),
    precio: Number(input.precio || 0),
    estado: 'PENDIENTE',
  };
  await apiSend('/api/pedidos', 'POST', row);
  return row;
}

export async function marcarPedidoAtendido(id: string) {
  await apiSend('/api/pedidos', 'PATCH', { id, estado: 'ATENDIDO' });
}

export async function marcarPedidosPorSku(sku: string): Promise<number> {
  const s = String(sku || '').trim().toLowerCase();
  if (!s) return 0;
  const pend = await listarPedidosPendientes();
  const match = pend.filter((p) => String(p.sku || '').trim().toLowerCase() === s);
  for (const p of match) await marcarPedidoAtendido(p.id);
  return match.length;
}

import { apiSend } from '@/lib/live';

export type EstadoUnidad = 'EN_TIENDA' | 'VENDIDA';

export type Unidad = {
  id: string;
  sku: string;
  codigo: string;
  estado: EstadoUnidad;
  createdAt: string;
  vendidaAt?: string;
};

function normCodigo(c: string) {
  return String(c || '').trim().toLowerCase();
}

async function apiList(): Promise<Unidad[]> {
  try {
    const res = await fetch('/api/unidades', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listarUnidades(): Promise<Unidad[]> {
  const rows = await apiList();
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function listarPorSku(sku: string): Promise<Unidad[]> {
  const s = String(sku || '').trim();
  if (!s) return [];
  try {
    const res = await fetch(`/api/unidades?sku=${encodeURIComponent(s)}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function disponiblesPorSku(sku: string): Promise<Unidad[]> {
  const rows = await listarPorSku(sku);
  return rows.filter((u) => u.estado === 'EN_TIENDA');
}

export async function buscarPorCodigo(codigo: string): Promise<Unidad | null> {
  const c = normCodigo(codigo);
  if (!c) return null;
  try {
    const res = await fetch(`/api/unidades?codigo=${encodeURIComponent(c)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const rows = Array.isArray(data) ? data : [];
    return (rows[0] as Unidad) || null;
  } catch {
    return null;
  }
}

export async function aplicarStockDesdeSeries(): Promise<number> {
  let cambiados = 0;
  try {
    const [prodRes, unidades] = await Promise.all([
      fetch('/api/productos', { cache: 'no-store' }),
      listarUnidades(),
    ]);
    if (!prodRes.ok) return 0;
    const productos = await prodRes.json();
    if (!Array.isArray(productos)) return 0;

    for (const p of productos as { id: string; sku?: string; stock?: number }[]) {
      const sku = String(p.sku || '').trim();
      if (!sku) continue;
      const delSku = unidades.filter((u) => String(u.sku || '').trim().toLowerCase() === sku.toLowerCase());
      if (delSku.length === 0) continue;
      const n = delSku.filter((u) => u.estado === 'EN_TIENDA').length;
      if (Number(p.stock || 0) === n) continue;
      cambiados += 1;
      await apiSend('/api/productos', 'POST', { ...p, stock: n });
    }
  } catch {
    return 0;
  }
  return cambiados;
}

export async function registrarUnidad(sku: string, codigo: string): Promise<Unidad> {
  const res = await apiSend('/api/unidades', 'POST', { sku: sku.trim(), codigo: codigo.trim() });
  if (res.status === 409) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Código duplicado');
  }
  if (!res.ok) throw new Error('No se pudo cargar');
  const row = (await res.json()) as Unidad;
  await aplicarStockDesdeSeries();
  return row;
}

export async function marcarVendida(codigo: string): Promise<Unidad | null> {
  const res = await apiSend('/api/unidades', 'PATCH', { codigo });
  if (!res.ok) return null;
  return (await res.json()) as Unidad;
}

export async function skusAgotadosConSerie(): Promise<{ sku: string }[]> {
  const all = await listarUnidades();
  const seen = new Set<string>();
  const out: { sku: string }[] = [];
  for (const u of all) {
    const sku = String(u.sku || '').trim();
    if (!sku || seen.has(sku.toLowerCase())) continue;
    seen.add(sku.toLowerCase());
    const n = all.filter((x) => String(x.sku || '').trim().toLowerCase() === sku.toLowerCase() && x.estado === 'EN_TIENDA')
      .length;
    if (n === 0) out.push({ sku });
  }
  return out;
}

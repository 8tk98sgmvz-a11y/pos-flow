import { apiSend } from '@/lib/live';

export type Garantia = {
  id: string;
  codigo: string;
  sku: string;
  producto: string;
  dias: number;
  createdAt: string;
};

const DIAS_DEFAULT = 30;

function norm(c: string) {
  return String(c || '').trim().toLowerCase();
}

async function apiList(): Promise<Garantia[]> {
  try {
    const res = await fetch('/api/garantias', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function listarGarantias(): Promise<Garantia[]> {
  const rows = await apiList();
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function buscarGarantiaPorCodigo(codigo: string): Promise<Garantia | null> {
  const c = norm(codigo);
  if (!c) return null;
  const rows = await apiList();
  return rows.find((g) => norm(g.codigo) === c) || null;
}

export async function registrarGarantia(input: {
  codigo: string;
  sku: string;
  producto: string;
  dias?: number;
}): Promise<Garantia> {
  const row: Garantia = {
    id: `gti-${Date.now()}`,
    codigo: input.codigo.trim(),
    sku: input.sku.trim(),
    producto: input.producto.trim(),
    dias: Number(input.dias || DIAS_DEFAULT),
    createdAt: new Date().toISOString(),
  };
  await apiSend('/api/garantias', 'POST', row);
  return row;
}

export function venceEl(g: Garantia): Date {
  const d = new Date(g.createdAt);
  d.setDate(d.getDate() + Number(g.dias || 0));
  return d;
}

export function estaVigente(g: Garantia): boolean {
  return venceEl(g).getTime() >= Date.now();
}

export function diasRestantes(g: Garantia): number {
  const ms = venceEl(g).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

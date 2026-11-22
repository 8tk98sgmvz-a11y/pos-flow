import { listarVentas } from '@/lib/ledger';
import { listarGastos, listarIngresos } from '@/lib/caja';
import { esCajon, esFiado, money } from '@/lib/money';
import { apiSend } from '@/lib/live';

export type Arqueo = {
  id: string;
  createdAt: string;
  declarado: number;
  sistema: number;
  diferencia: number;
};

export async function efectivoEnCajon(): Promise<number> {
  const [ventasRaw, gastosRaw, ingresosRaw] = await Promise.all([
    listarVentas(),
    listarGastos(),
    listarIngresos(),
  ]);

  const day = new Date().toISOString().slice(0, 10);

  const ventasEfectivo = (Array.isArray(ventasRaw) ? ventasRaw : [])
    .filter((v) => String(v.createdAt || '').slice(0, 10) === day)
    .filter((v) => esCajon(v.canal) && !esFiado(v.canal))
    .reduce((acc, v) => acc + Number(v.montoTotal || 0), 0);

  const gastosCajon = (Array.isArray(gastosRaw) ? gastosRaw : [])
    .filter((g) => String(g.createdAt || '').slice(0, 10) === day)
    .filter((g) => esCajon(g.canal))
    .reduce((acc, g) => acc + Number(g.monto || 0), 0);

  const ingresosCajon = (Array.isArray(ingresosRaw) ? ingresosRaw : [])
    .filter((i) => String(i.createdAt || '').slice(0, 10) === day)
    .reduce((acc, i) => acc + Number(i.monto || 0), 0);

  return money(ventasEfectivo + ingresosCajon - gastosCajon);
}

export async function efectivoSistemaHoy(): Promise<number> {
  return efectivoEnCajon();
}

export async function listarArqueos(): Promise<Arqueo[]> {
  try {
    const res = await fetch('/api/arqueo', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function registrarArqueo(declarado: number): Promise<Arqueo> {
  const sistema = await efectivoEnCajon();
  const diferencia = money(Number(declarado || 0) - sistema);

  const res = await apiSend('/api/arqueo', 'POST', {
    declarado: money(Number(declarado || 0)),
    sistema,
    diferencia,
  });

  if (!res.ok) {
    throw new Error('No se pudo guardar el arqueo');
  }

  const data = await res.json().catch(() => ({}));
  return {
    id: data.id,
    createdAt: new Date().toISOString(),
    declarado: money(Number(declarado || 0)),
    sistema,
    diferencia,
  };
}

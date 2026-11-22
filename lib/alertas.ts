import { listarArqueos } from '@/lib/arqueo';
import { totalCxcAbiertas } from '@/lib/cxc';
import { totalCxpAbiertas } from '@/lib/cxp';

export type Alerta = {
  id: string;
  nivel: 'rojo' | 'ambar' | 'ok';
  titulo: string;
  detalle: string;
  href: string;
  accion: string;
};

function soles(n: number) {
  const sign = n < 0 ? '−' : '';
  return `${sign}S/ ${Math.abs(Number(n || 0)).toFixed(2)}`;
}

export async function calcularAlertas(): Promise<Alerta[]> {
  const out: Alerta[] = [];

  const arqueos = await listarArqueos();
  const hoy = new Date().toISOString().slice(0, 10);
  const arqueoHoy = arqueos.find((a) => String(a.createdAt || '').slice(0, 10) === hoy);
  const diferenciaHoy = arqueoHoy ? Number(arqueoHoy.diferencia || 0) : null;

  if (diferenciaHoy === null) {
    out.push({
      id: 'arqueo-pendiente',
      nivel: 'rojo',
      titulo: 'No hay arqueo de hoy',
      detalle: 'Cierra caja para cuadrar el día.',
      href: '/arqueo',
      accion: 'Hacer arqueo',
    });
  } else if (Math.abs(diferenciaHoy) > 0.5) {
    out.push({
      id: 'arqueo-descuadrado',
      nivel: 'rojo',
      titulo: `Arqueo descuadrado ${soles(diferenciaHoy)}`,
      detalle: 'Revisa el cajón o vuelve a contar.',
      href: '/arqueo',
      accion: 'Revisar arqueo',
    });
  } else {
    out.push({
      id: 'arqueo-ok',
      nivel: 'ok',
      titulo: 'Arqueo cuadrado hoy',
      detalle: 'Caja cerrada correctamente.',
      href: '/arqueo',
      accion: 'Ver arqueo',
    });
  }

  const cxc = await totalCxcAbiertas();
  if (cxc > 0) {
    out.push({
      id: 'cxc',
      nivel: cxc > 1000 ? 'rojo' : 'ambar',
      titulo: `Cobra ${soles(cxc)} en fiados`,
      detalle: 'Ese dinero no está en caja.',
      href: '/cuentas-por-cobrar',
      accion: 'Ver fiados',
    });
  }

  const cxp = await totalCxpAbiertas();
  if (cxp > 0) {
    out.push({
      id: 'cxp',
      nivel: 'ambar',
      titulo: `Debes ${soles(cxp)} a proveedores`,
      detalle: 'Sale de caja cuando pagues.',
      href: '/cuentas-por-pagar',
      accion: 'Ver CxP',
    });
  }

  if (out.length === 0) {
    out.push({
      id: 'ok',
      nivel: 'ok',
      titulo: 'Sin urgencias. El día está limpio.',
      detalle: 'Sigue vendiendo.',
      href: '/pos',
      accion: 'Ir al POS',
    });
  }

  return out;
} 
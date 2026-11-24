import Link from 'next/link';
import { Card } from '@/components/ui';
import { Money } from './money';

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function cajaNota(
  ventasHoy: number,
  arqueoHoy: { declarado: number; diferencia: number } | null,
  digitalHoy: number,
  fiadosHoy: number
) {
  if (ventasHoy > 0 && !arqueoHoy) return 'Falta contar caja';
  if (arqueoHoy && arqueoHoy.diferencia !== 0) {
    const d = arqueoHoy.diferencia;
    return d > 0 ? `Sobra S/ ${fmt(d)}` : `Falta S/ ${fmt(Math.abs(d))}`;
  }
  if (arqueoHoy) return 'Caja cuadrada';
  const fiados = fiadosHoy > 0 ? ` · ${fiadosHoy} fiados fuera` : '';
  return `Digital S/ ${fmt(digitalHoy)}${fiados}`;
}

export function DashboardKpis({
  cajon,
  digitalHoy,
  ventasHoy,
  fiadosHoy = 0,
  arqueoHoy,
  cxcTotal,
  cxcN,
  cxpTotal,
  cxpN,
}: {
  cajon: number;
  digitalHoy: number;
  ventasHoy: number;
  fiadosHoy?: number;
  arqueoHoy: { declarado: number; diferencia: number } | null;
  cxcTotal: number;
  cxcN: number;
  cxpTotal: number;
  cxpN: number;
}) {
  const notaCaja = cajaNota(ventasHoy, arqueoHoy, digitalHoy, fiadosHoy);
  const cajaAlerta = (ventasHoy > 0 && !arqueoHoy) || (arqueoHoy != null && arqueoHoy.diferencia !== 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Link href="/arqueo" className="block">
        <Card className="p-5 h-full hover:bg-surface-raised transition-colors">
          <p className="text-caption text-muted">En caja</p>
          <div className="mt-2">
            <Money value={fmt(cajon)} />
          </div>
          <p className={`text-caption mt-3 ${cajaAlerta ? 'text-warning' : 'text-muted'}`}>{notaCaja}</p>
        </Card>
      </Link>

      <Link href="/cuentas-por-cobrar" className="block">
        <Card className="p-5 h-full hover:bg-surface-raised transition-colors">
          <p className="text-caption text-muted">Te deben</p>
          <div className="mt-2">
            <Money value={fmt(cxcTotal)} />
          </div>
          <p className="text-caption text-muted mt-3">{cxcN} fiados</p>
        </Card>
      </Link>

      <Link href="/cuentas-por-pagar" className="block">
        <Card className="p-5 h-full hover:bg-surface-raised transition-colors">
          <p className="text-caption text-muted">Debes</p>
          <div className="mt-2">
            <Money value={fmt(cxpTotal)} />
          </div>
          <p className="text-caption text-muted mt-3">{cxpN} cuentas</p>
        </Card>
      </Link>
    </div>
  );
}

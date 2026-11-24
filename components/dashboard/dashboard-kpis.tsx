import Link from 'next/link';
import { Card, Text } from '@/components/ui';
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-ds-3">
      <Link href="/arqueo" className="block">
        <Card className="p-ds-5 h-full hover:bg-surface-raised transition-colors duration-ds">
          <Text variant="caption">En caja</Text>
          <div className="mt-ds-2">
            <Money value={fmt(cajon)} />
          </div>
          <Text variant="caption" className={`mt-ds-3 ${cajaAlerta ? 'text-warning' : ''}`}>
            {notaCaja}
          </Text>
        </Card>
      </Link>

      <Link href="/cuentas-por-cobrar" className="block">
        <Card className="p-ds-5 h-full hover:bg-surface-raised transition-colors duration-ds">
          <Text variant="caption">Te deben</Text>
          <div className="mt-ds-2">
            <Money value={fmt(cxcTotal)} />
          </div>
          <Text variant="caption" className="mt-ds-3">
            {cxcN} fiados
          </Text>
        </Card>
      </Link>

      <Link href="/cuentas-por-pagar" className="block">
        <Card className="p-ds-5 h-full hover:bg-surface-raised transition-colors duration-ds">
          <Text variant="caption">Debes</Text>
          <div className="mt-ds-2">
            <Money value={fmt(cxpTotal)} />
          </div>
          <Text variant="caption" className="mt-ds-3">
            {cxpN} cuentas
          </Text>
        </Card>
      </Link>
    </div>
  );
}

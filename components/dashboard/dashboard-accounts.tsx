import type { PuntoHora } from '@/lib/actividad';
import { AccountCard } from './account-card';
import { ActivityChart } from './activity-chart';
import { DashboardSplit } from './dashboard-grids';
import { Icons } from './icons';
import { NoticeBox } from './notice-box';

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function DashboardAccounts({
  cxcTotal,
  cxcN,
  cxpTotal,
  cxpN,
  horas,
  tope,
}: {
  cxcTotal: number;
  cxcN: number;
  cxpTotal: number;
  cxpN: number;
  horas: PuntoHora[];
  tope: number;
}) {
  return (
    <DashboardSplit>
      <AccountCard
        icon={<Icons.FileText />}
        tone="blue"
        title="Cuentas por Cobrar"
        amount={fmt(cxcTotal)}
        subtitle={`${cxcN} fiados abiertos`}
      >
        <NoticeBox
          variant="danger"
          title="Pendiente real"
          description="Mismo dato que /cuentas-por-cobrar"
        />
      </AccountCard>

      <AccountCard
        icon={<Icons.CreditCard />}
        tone="violet"
        title="Cuentas por Pagar"
        amount={fmt(cxpTotal)}
        subtitle={`${cxpN} facturas abiertas`}
      >
        <NoticeBox variant="warning" title="Deuda real" description={`S/ ${fmt(cxpTotal)}`} />
      </AccountCard>

      <ActivityChart horas={horas} tope={tope} />
    </DashboardSplit>
  );
}

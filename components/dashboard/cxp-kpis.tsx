import { CxpAlertTriangleIcon, CxpCalendarBoxIcon, CxpPeopleIcon, CxpWalletIcon } from './cxp-icons';
import { CxpStatCard } from './cxp-stat-card';

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CxpKpis({
  total,
  totalVencidas,
  vencidasN,
  abiertasN,
  proveedores,
}: {
  total: number;
  totalVencidas: number;
  vencidasN: number;
  abiertasN: number;
  proveedores: number;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <CxpStatCard
        icon={<CxpWalletIcon />}
        iconBg="bg-[#1E3A8A]"
        title="Total por pagar"
        value={`S/ ${fmt(total)}`}
      />
      <CxpStatCard
        icon={<CxpAlertTriangleIcon />}
        iconBg="bg-[#7F1D1D]"
        title="Vencidas"
        value={`S/ ${fmt(totalVencidas)}`}
        valueClassName="text-[#F87171]"
        badge={<span className="text-[11px] px-2 py-0.5 rounded-md bg-[#7F1D1D]">{vencidasN}</span>}
      />
      <CxpStatCard
        icon={<CxpCalendarBoxIcon />}
        iconBg="bg-[#1E3A8A]"
        title="Abiertas"
        value={abiertasN}
      />
      <CxpStatCard
        icon={<CxpPeopleIcon />}
        iconBg="bg-[#5B21B6]"
        title="Proveedores con deuda"
        value={proveedores}
      />
    </div>
  );
}

import { CxcClockIcon, CxcPersonClockIcon, CxcPersonIcon, CxcTeslaTIcon } from './cxc-icons';
import { CxcStatCard } from './cxc-stat-card';

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CxcKpis({
  total,
  totalVencidas,
  vencidasN,
  abiertasN,
  clientes,
}: {
  total: number;
  totalVencidas: number;
  vencidasN: number;
  abiertasN: number;
  clientes: number;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <CxcStatCard
        icon={<CxcClockIcon />}
        iconBg="bg-[#2563EB]"
        title="Total por cobrar"
        value={`S/ ${fmt(total)}`}
        footer="Fiados abiertos"
      />
      <CxcStatCard
        icon={<CxcTeslaTIcon />}
        iconBg="bg-[#9F1239]"
        title="Vencidas"
        value={`S/ ${fmt(totalVencidas)}`}
        badge={
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#7F1D1D] text-white">{vencidasN}</span>
        }
        footer="Más de 7 días"
      />
      <CxcStatCard
        icon={<CxcPersonClockIcon />}
        iconBg="bg-[#6D28D9]"
        title="Abiertas"
        value={abiertasN}
        footer="Sin cobrar"
      />
      <CxcStatCard
        icon={<CxcPersonIcon />}
        iconBg="bg-[#0F766E]"
        title="Clientes con deuda"
        value={clientes}
        footer="Nombres distintos"
      />
    </div>
  );
}

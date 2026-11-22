import { CxcKpis } from './cxc-kpis';
import { CxcShell } from './cxc-shell';
import { CxcTablePanel } from './cxc-table-panel';
import { CxcToolbar } from './cxc-toolbar';

type CuentaPorCobrar = {
  id: string;
  createdAt: string;
  cliente: string;
  descripcion: string;
  monto: number;
  estado: 'ABIERTA' | 'PAGADA';
  ventaId?: string;
  telefono?: string;
};

export function CxcView({
  q,
  onQ,
  abiertasN,
  total,
  totalVencidas,
  vencidasN,
  clientes,
  filtradas,
  onPago,
  onWhatsApp,
}: {
  q: string;
  onQ: (v: string) => void;
  abiertasN: number;
  total: number;
  totalVencidas: number;
  vencidasN: number;
  clientes: number;
  filtradas: CuentaPorCobrar[];
  onPago: (r: CuentaPorCobrar) => void;
  onWhatsApp: (r: CuentaPorCobrar) => void;
}) {
  return (
    <CxcShell>
      <CxcToolbar subtitle={`${abiertasN} fiados abiertos · se actualiza solo`} q={q} onQ={onQ} />
      <CxcKpis
        total={total}
        totalVencidas={totalVencidas}
        vencidasN={vencidasN}
        abiertasN={abiertasN}
        clientes={clientes}
      />
      <CxcTablePanel
        rows={filtradas}
        total={total}
        abiertasN={abiertasN}
        onPago={onPago}
        onWhatsApp={onWhatsApp}
      />
    </CxcShell>
  );
}

import { CxpKpis } from './cxp-kpis';
import { CxpShell } from './cxp-shell';
import { CxpTablePanel } from './cxp-table-panel';
import { CxpToolbar } from './cxp-toolbar';

type CuentaPorPagar = {
  id: string;
  createdAt: string;
  proveedor: string;
  descripcion: string;
  monto: number;
  estado: 'ABIERTA' | 'PAGADA';
  fechaVencimiento?: string;
  categoria?: string;
};

export function CxpView({
  q,
  onQ,
  onAlta,
  total,
  totalVencidas,
  vencidasN,
  abiertasN,
  proveedores,
  filtradas,
  abiertas,
  onPago,
}: {
  q: string;
  onQ: (v: string) => void;
  onAlta: () => void;
  total: number;
  totalVencidas: number;
  vencidasN: number;
  abiertasN: number;
  proveedores: number;
  filtradas: CuentaPorPagar[];
  abiertas: CuentaPorPagar[];
  onPago: (r: CuentaPorPagar) => void;
}) {
  return (
    <CxpShell>
      <CxpToolbar q={q} onQ={onQ} onAlta={onAlta} />
      <CxpKpis
        total={total}
        totalVencidas={totalVencidas}
        vencidasN={vencidasN}
        abiertasN={abiertasN}
        proveedores={proveedores}
      />
      <CxpTablePanel filtradas={filtradas} abiertas={abiertas} total={total} onPago={onPago} />
    </CxpShell>
  );
}

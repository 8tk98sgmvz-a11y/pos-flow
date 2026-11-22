import { CxcAlerts } from './cxc-alerts';
import { CxcTable, CxcTableEmpty } from './cxc-table';
import { CxcTableRow } from './cxc-table-row';

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

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE');
}

function plusDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d;
}

function diasAtraso(iso: string) {
  const vence = plusDays(iso, 7);
  const now = new Date();
  const diff = Math.floor((now.getTime() - vence.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

export function CxcTablePanel({
  rows,
  total,
  abiertasN,
  onPago,
  onWhatsApp,
}: {
  rows: CuentaPorCobrar[];
  total: number;
  abiertasN: number;
  onPago: (r: CuentaPorCobrar) => void;
  onWhatsApp: (r: CuentaPorCobrar) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-3 items-start">
      <CxcTable>
        {rows.length === 0 && <CxcTableEmpty />}
        {rows.map((r) => {
          const atraso = r.estado === 'PAGADA' ? 0 : diasAtraso(r.createdAt);
          const estado = r.estado === 'PAGADA' ? 'Pagada' : atraso > 0 ? 'Vencida' : 'Pendiente';
          return (
            <CxcTableRow
              key={r.id}
              cliente={r.cliente}
              descripcion={r.descripcion}
              monto={`S/ ${fmt(Number(r.monto || 0))}`}
              fecha={fmtFecha(r.createdAt)}
              vence={fmtFecha(plusDays(r.createdAt, 7).toISOString())}
              estado={estado}
              dias={atraso > 0 ? atraso : '—'}
              atraso={atraso > 0}
              pagoDisabled={r.estado === 'PAGADA'}
              onPago={() => onPago(r)}
              onWhatsApp={() => onWhatsApp(r)}
            />
          );
        })}
      </CxcTable>

      <CxcAlerts
        empty={total === 0}
        title={`Tienes S/ ${fmt(total)} por cobrar`}
        detail={`${abiertasN} fiados abiertos desde el POS.`}
      />
    </div>
  );
}

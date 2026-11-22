import { CxpAlerts } from './cxp-alerts';
import { CxpTable, CxpTableEmpty } from './cxp-table';
import { CxpTableRow } from './cxp-table-row';
import { CxpVencimientoItem, CxpVencimientos } from './cxp-vencimientos';

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
  const diff = Math.floor((Date.now() - plusDays(iso, 7).getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

export function CxpTablePanel({
  filtradas,
  abiertas,
  total,
  onPago,
}: {
  filtradas: CuentaPorPagar[];
  abiertas: CuentaPorPagar[];
  total: number;
  onPago: (r: CuentaPorPagar) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-3 items-stretch">
      <CxpTable>
        {filtradas.length === 0 && <CxpTableEmpty />}
        {filtradas.map((r) => {
          const atraso = r.estado === 'PAGADA' ? 0 : diasAtraso(r.createdAt);
          const estado = r.estado === 'PAGADA' ? 'Pagada' : atraso > 0 ? 'Vencida' : 'Pendiente';
          const letra = (r.proveedor || 'P').slice(0, 1).toUpperCase();
          return (
            <CxpTableRow
              key={r.id}
              letra={letra}
              proveedor={r.proveedor}
              descripcion={r.descripcion}
              monto={`S/ ${fmt(Number(r.monto || 0))}`}
              fecha={fmtFecha(r.createdAt)}
              vence={fmtFecha(plusDays(r.createdAt, 7).toISOString())}
              estado={estado}
              dias={atraso > 0 ? `${atraso} días` : '—'}
              atraso={atraso > 0}
              pagoDisabled={r.estado === 'PAGADA'}
              onPago={() => onPago(r)}
            />
          );
        })}
      </CxpTable>

      <div className="col-span-3 flex flex-col gap-2">
        <CxpVencimientos empty={abiertas.length === 0}>
          {abiertas.slice(0, 4).map((r) => (
            <CxpVencimientoItem
              key={r.id}
              fecha={fmtFecha(plusDays(r.createdAt, 7).toISOString())}
              proveedor={r.proveedor}
              descripcion={r.descripcion}
              monto={`S/ ${fmt(Number(r.monto || 0))}`}
            />
          ))}
        </CxpVencimientos>

        <CxpAlerts
          title={`Tienes S/ ${fmt(total)} por pagar`}
          detail={`${abiertas.length} facturas abiertas`}
        />
      </div>
    </div>
  );
}

import { ReportesTable } from './reportes-table';
import { ReportesTableRow } from './reportes-table-row';
import { ReportesTableStatus } from './reportes-table-status';

type Reporte = {
  producto: string;
  unidades: number;
  total: number;
  costo: number;
  margen: number;
};

function soles(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

export function ReportesPanel({ loading, data }: { loading: boolean; data: Reporte[] }) {
  return (
    <ReportesTable>
      {loading && <ReportesTableStatus>Cargando…</ReportesTableStatus>}
      {!loading && data.length === 0 && <ReportesTableStatus>Sin datos</ReportesTableStatus>}
      {data.map((r, i) => (
        <ReportesTableRow
          key={i}
          producto={r.producto}
          unidades={r.unidades}
          total={soles(r.total)}
          costo={soles(r.costo)}
          margen={soles(r.margen)}
          margenPositivo={r.margen >= 0}
        />
      ))}
    </ReportesTable>
  );
}

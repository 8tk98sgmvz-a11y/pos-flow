import { ReportesPageHeader } from './reportes-page-header';
import { ReportesPanel } from './reportes-panel';
import { ReportesShell } from './reportes-shell';

type Reporte = {
  producto: string;
  unidades: number;
  total: number;
  costo: number;
  margen: number;
};

export function ReportesView({ loading, data }: { loading: boolean; data: Reporte[] }) {
  return (
    <ReportesShell>
      <ReportesPageHeader />
      <ReportesPanel loading={loading} data={data} />
    </ReportesShell>
  );
}

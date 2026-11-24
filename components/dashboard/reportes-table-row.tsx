import { Badge, TableCell, TableRow } from '@/components/ui';

export function ReportesTableRow({
  producto,
  unidades,
  total,
  costo,
  margen,
  margenPositivo,
}: {
  producto: string;
  unidades: number;
  total: string;
  costo: string;
  margen: string;
  margenPositivo: boolean;
}) {
  return (
    <TableRow>
      <TableCell>{producto}</TableCell>
      <TableCell className="text-right">{unidades}</TableCell>
      <TableCell className="text-right">{total}</TableCell>
      <TableCell className="text-right">{costo}</TableCell>
      <TableCell className="text-right">
        <Badge variant={margenPositivo ? 'success' : 'danger'}>{margen}</Badge>
      </TableCell>
    </TableRow>
  );
}

import type { ReactNode } from 'react';
import { Table, TableHead, TableHeader } from '@/components/ui';

export function ReportesTable({ children }: { children: ReactNode }) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Producto</TableHead>
          <TableHead className="text-right">Unidades</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Costo</TableHead>
          <TableHead className="text-right">Margen</TableHead>
        </tr>
      </TableHeader>
      <tbody>{children}</tbody>
    </Table>
  );
}

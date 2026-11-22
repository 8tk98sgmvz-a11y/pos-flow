import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export function FlujoSalesList({ empty, children }: { empty: boolean; children: ReactNode }) {
  return (
    <Card className="p-4">
      <p className="text-[14px] font-medium mb-3">Ventas</p>
      {empty && <p className="text-slate-500 text-sm">No hay ventas en este período.</p>}
      {children}
    </Card>
  );
}

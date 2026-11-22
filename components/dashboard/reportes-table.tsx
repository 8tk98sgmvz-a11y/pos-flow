import type { ReactNode } from 'react';

export function ReportesTable({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-[13px]">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-3">Producto</th>
            <th className="text-right p-3">Unidades</th>
            <th className="text-right p-3">Total</th>
            <th className="text-right p-3">Costo</th>
            <th className="text-right p-3">Margen</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

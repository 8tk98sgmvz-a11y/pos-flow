import type { ReactNode } from 'react';

export function CxcTable({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-8 bg-[#0B1220] border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-[12px] text-white">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left font-medium px-3 py-2.5">Cliente</th>
            <th className="text-right font-medium px-2 py-2.5">Monto</th>
            <th className="text-left font-medium px-2 py-2.5">Fecha</th>
            <th className="text-left font-medium px-2 py-2.5">Vence</th>
            <th className="text-left font-medium px-2 py-2.5">Estado</th>
            <th className="text-center font-medium px-2 py-2.5">Días</th>
            <th className="text-right font-medium px-3 py-2.5">Acciones</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function CxcTableEmpty() {
  return (
    <tr>
      <td colSpan={7} className="px-3 py-8 text-center text-white/50">
        Aún no hay fiados. Cobra uno en el POS con Fiado.
      </td>
    </tr>
  );
}

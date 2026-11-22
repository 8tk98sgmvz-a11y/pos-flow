import type { ReactNode } from 'react';

export function CxpTable({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-9 bg-[#0B1220] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-white/10 text-white/80">
            <th className="text-left font-medium px-3 py-2">Proveedor</th>
            <th className="text-right font-medium px-2 py-2">Monto</th>
            <th className="text-left font-medium px-2 py-2">Fecha factura</th>
            <th className="text-left font-medium px-2 py-2">Vencimiento</th>
            <th className="text-left font-medium px-2 py-2">Estado</th>
            <th className="text-center font-medium px-2 py-2">Días atraso</th>
            <th className="text-right font-medium px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function CxpTableEmpty() {
  return (
    <tr>
      <td colSpan={7} className="px-3 py-8 text-center text-white/50">
        Aún no hay facturas. Usa + Registrar factura.
      </td>
    </tr>
  );
}

import type { ReactNode } from 'react';
import { CxpCalendarIcon } from './cxp-icons';

export function CxpVencimientos({ empty, children }: { empty: boolean; children: ReactNode }) {
  return (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-3 flex-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-medium flex items-center gap-2">
          <CxpCalendarIcon /> Próximos vencimientos
        </p>
      </div>
      <div className="divide-y divide-white/10">
        {children}
        {empty && <p className="text-[12px] text-white/50 py-2">Sin vencimientos</p>}
      </div>
    </div>
  );
}

export function CxpVencimientoItem({
  fecha,
  proveedor,
  descripcion,
  monto,
}: {
  fecha: string;
  proveedor: string;
  descripcion: string;
  monto: string;
}) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5">
      <div>
        <p className="text-[10px] text-white/60">{fecha}</p>
        <p className="text-[12px] leading-tight">{proveedor}</p>
        <p className="text-[10px] text-white/60">{descripcion}</p>
      </div>
      <p className="text-[12px] whitespace-nowrap">{monto}</p>
    </div>
  );
}

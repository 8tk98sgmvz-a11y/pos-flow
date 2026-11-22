import { CxpChevron, CxpDateIcon, CxpFilterIcon, CxpSearchIcon } from './cxp-icons';

export function CxpToolbar({
  q,
  onQ,
  onAlta,
}: {
  q: string;
  onQ: (v: string) => void;
  onAlta: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-semibold">Cuentas por Pagar</h1>
        <p className="text-[12px] text-white/80 mt-1">Todo lo que debes · Control de pagos y proveedores</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-9 w-[360px] rounded-xl border border-white/10 bg-[#0B1220] px-3 flex items-center gap-2">
          <CxpSearchIcon />
          <input
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Buscar proveedor, factura o monto..."
            className="flex-1 bg-transparent text-[12px] text-white placeholder:text-white/50 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-xl border border-white/10 text-[12px] flex items-center gap-2">
            <CxpFilterIcon /> Estado <CxpChevron />
          </button>
          <button className="h-9 px-3 rounded-xl border border-white/10 text-[12px] flex items-center gap-2">
            <CxpDateIcon /> Fecha <CxpChevron />
          </button>
          <button onClick={onAlta} className="h-9 px-3 rounded-xl bg-blue-600 text-[12px] font-semibold">
            + Registrar factura
          </button>
        </div>
      </div>
    </div>
  );
}

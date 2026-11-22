import { CxcStatusBadge } from './cxc-status-badge';

export function CxpTableRow({
  letra,
  proveedor,
  descripcion,
  monto,
  fecha,
  vence,
  estado,
  dias,
  atraso,
  pagoDisabled,
  onPago,
}: {
  letra: string;
  proveedor: string;
  descripcion: string;
  monto: string;
  fecha: string;
  vence: string;
  estado: string;
  dias: string;
  atraso: boolean;
  pagoDisabled: boolean;
  onPago: () => void;
}) {
  return (
    <tr className="border-t border-white/5">
      <td className="px-3 py-3 align-middle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#2563EB]">
            {letra}
          </div>
          <div>
            <p className="leading-tight">{proveedor}</p>
            <p className="text-[10px] text-white/60">{descripcion}</p>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 text-right whitespace-nowrap">{monto}</td>
      <td className="px-2 py-3 whitespace-nowrap">{fecha}</td>
      <td className="px-2 py-3 whitespace-nowrap">{vence}</td>
      <td className="px-2 py-3">
        <CxcStatusBadge estado={estado} />
      </td>
      <td className={`px-2 py-3 text-center ${atraso ? 'text-red-400 font-medium' : 'text-white/50'}`}>
        {dias}
      </td>
      <td className="px-2 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={onPago}
            disabled={pagoDisabled}
            className="h-7 px-2 rounded-lg border border-blue-500/50 text-[11px] text-blue-300 whitespace-nowrap disabled:opacity-40"
          >
            Registrar pago
          </button>
        </div>
      </td>
    </tr>
  );
}

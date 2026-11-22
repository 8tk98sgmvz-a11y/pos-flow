import { CxcRowPersonIcon } from './cxc-icons';
import { CxcRowActions } from './cxc-row-actions';
import { CxcStatusBadge } from './cxc-status-badge';

export function CxcTableRow({
  cliente,
  descripcion,
  monto,
  fecha,
  vence,
  estado,
  dias,
  atraso,
  pagoDisabled,
  onPago,
  onWhatsApp,
}: {
  cliente: string;
  descripcion: string;
  monto: string;
  fecha: string;
  vence: string;
  estado: string;
  dias: string | number;
  atraso: boolean;
  pagoDisabled: boolean;
  onPago: () => void;
  onWhatsApp: () => void;
}) {
  return (
    <tr className="border-t border-white/5">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2563EB]">
            <CxcRowPersonIcon />
          </div>
          <div>
            <p className="text-white leading-tight">{cliente}</p>
            <p className="text-[10px] text-white/80">{descripcion}</p>
          </div>
        </div>
      </td>
      <td className="px-2 py-2.5 text-right whitespace-nowrap">{monto}</td>
      <td className="px-2 py-2.5 whitespace-nowrap">{fecha}</td>
      <td className="px-2 py-2.5 whitespace-nowrap">{vence}</td>
      <td className="px-2 py-2.5">
        <CxcStatusBadge estado={estado} />
      </td>
      <td className={`px-2 py-2.5 text-center ${atraso ? 'text-red-400 font-medium' : 'text-white'}`}>
        {dias}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        <CxcRowActions pagoDisabled={pagoDisabled} onPago={onPago} onWhatsApp={onWhatsApp} />
      </td>
    </tr>
  );
}

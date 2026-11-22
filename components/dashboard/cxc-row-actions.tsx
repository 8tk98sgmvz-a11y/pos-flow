import { CxcDotsIcon, CxcFileIcon, CxcWhatsAppIcon } from './cxc-icons';

export function CxcRowActions({
  pagoDisabled,
  onPago,
  onWhatsApp,
}: {
  pagoDisabled: boolean;
  onPago: () => void;
  onWhatsApp: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        onClick={onPago}
        disabled={pagoDisabled}
        className="h-8 px-2 rounded-lg border border-white/15 text-[11px] text-white flex items-center gap-1.5 disabled:opacity-40"
      >
        <CxcFileIcon /> Pago
      </button>
      <button
        onClick={onWhatsApp}
        className="h-8 px-2 rounded-lg border border-white/20 text-[11px] text-white flex items-center gap-1.5"
      >
        <CxcWhatsAppIcon /> WhatsApp
      </button>
      <button className="h-8 w-8 rounded-lg border border-white/15 flex items-center justify-center">
        <CxcDotsIcon />
      </button>
    </div>
  );
}

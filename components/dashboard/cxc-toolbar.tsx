import Link from 'next/link';
import { CxcChevron } from './cxc-icons';

export function CxcToolbar({
  subtitle,
  q,
  onQ,
}: {
  subtitle: string;
  q: string;
  onQ: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-semibold text-white">Cuentas por Cobrar</h1>
        <p className="text-[12px] text-white mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Buscar cliente..."
          className="h-9 w-[240px] rounded-xl border border-white/10 bg-[#0B1220] px-3 text-[12px] text-white placeholder:text-white/60 outline-none"
        />
        <button className="h-9 px-3 rounded-xl border border-white/10 text-[12px] text-white flex items-center gap-2">
          Estado <CxcChevron />
        </button>
        <Link
          href="/pos"
          className="h-9 px-3 rounded-xl bg-blue-600 text-[12px] font-semibold text-white flex items-center"
        >
          + Registrar fiado
        </Link>
      </div>
    </div>
  );
}

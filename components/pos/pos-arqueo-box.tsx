import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PosInput } from './pos-input';

export function PosArqueoBox({
  contadoCaja,
  onContadoCaja,
  onCerrarArqueo,
}: {
  contadoCaja: string;
  onContadoCaja: (v: string) => void;
  onCerrarArqueo: () => void;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Cerrar caja</p>
      <p className="text-[12px] text-neutral-400 mb-2">
        Cuenta el cajón. El sistema compara después. El saldo no se muestra aquí.
      </p>
      <PosInput
        type="number"
        value={contadoCaja}
        onChange={(e) => onContadoCaja(e.target.value)}
        placeholder="¿Cuánto hay en el cajón?"
        className="h-10 px-3 text-xs text-white mb-2"
      />
      <Button type="button" variant="secondary" className="w-full h-10 text-xs" onClick={onCerrarArqueo}>
        Cerrar arqueo
      </Button>
      <Link href="/arqueo" className="block text-center text-[11px] text-neutral-500 mt-2 hover:text-white">
        Ver historial →
      </Link>
    </div>
  );
}

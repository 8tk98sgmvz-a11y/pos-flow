import { ArqueoContadoCard } from './arqueo-contado-card';
import { ArqueoSistemaCard } from './arqueo-sistema-card';

export function ArqueoCards({
  sistemaLabel,
  mostrar,
  onToggle,
  contado,
  onContado,
  onSave,
}: {
  sistemaLabel: string;
  mostrar: boolean;
  onToggle: () => void;
  contado: string;
  onContado: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      <ArqueoSistemaCard value={sistemaLabel} mostrar={mostrar} onToggle={onToggle} />
      <ArqueoContadoCard value={contado} onChange={onContado} onSave={onSave} />
    </div>
  );
}

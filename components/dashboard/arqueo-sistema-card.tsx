import { ArqueoButton } from './arqueo-button';
import { ArqueoCard } from './arqueo-card';

export function ArqueoSistemaCard({
  value,
  mostrar,
  onToggle,
}: {
  value: string;
  mostrar: boolean;
  onToggle: () => void;
}) {
  return (
    <ArqueoCard>
      <p className="text-[13px] text-slate-400 mb-2">Lo que dice el sistema hoy (efectivo − gastos)</p>
      <p className="text-[28px] font-semibold font-mono">{mostrar ? value : '••••••'}</p>
      <ArqueoButton variant="ghost" onClick={onToggle}>
        {mostrar ? 'Ocultar' : 'Mostrar al dueño'}
      </ArqueoButton>
    </ArqueoCard>
  );
}
